import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import RewardsModel from '../models/RewardsModel'
import RewardsPeriodModel from '../models/RewardsPeriodModel'
import contractsManagerDAO from './ContractsManagerDAO'
import resultCodes from '../../node_modules/chronobank-smart-contracts/common/errors'

export const TX_WITHDRAW_REWARD = 'withdrawReward'
export const TX_CLOSE_PERIOD = 'closePeriod'

export default class RewardsDAO extends AbstractContractDAO {
  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/Rewards.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )

    this._okCodes = [...this._okCodes, resultCodes.REWARD_CALCULATION_FAILED] // TODO @bshevchenko: MINT-279
  }

  /** @returns {Promise<ERC20DAO>} */
  getAssetDAO () {
    return this._call('getAssets').then(addresses => {
      return contractsManagerDAO.getERC20DAO(addresses[0])
    })
  }

  getPeriodLength () {
    return this._callNum('getCloseInterval')
  }

  getLastPeriod () {
    return this._callNum('lastPeriod')
  }

  getLastClosedPeriod () {
    return this._callNum('lastClosedPeriod')
      .catch(() => 0) // no closed periods yet
  }

  async getDepositBalanceInPeriod (address: string, periodId: number) {
    const balance = await this._callNum('depositBalanceInPeriod', [address, periodId])
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    return timeDAO.removeDecimals(balance)
  }

  async getAssetBalanceInPeriod (periodId: number) {
    const assetDAO = await this.getAssetDAO()
    const assetAddress = await assetDAO.getAddress()
    const balance = await this._callNum('assetBalanceInPeriod', [assetAddress, periodId])
    return assetDAO.removeDecimals(balance)
  }

  /** @returns {boolean} */
  getPeriodClosedState (id: number) {
    return this._call('isClosed', [id])
      .catch(() => false) // no closed periods yet
      .then(r => r)
  }

  async getTotalDepositInPeriod (id: number) {
    const deposit = await this._callNum('totalDepositInPeriod', [id])
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    return timeDAO.removeDecimals(deposit)
  }

  async getCurrentAccumulated () {
    const address = await this.getAddress()
    const assetDAO = await this.getAssetDAO()
    const assetBalance = await assetDAO.getAccountBalance(address)
    const assetAddress = await assetDAO.getAddress()
    const rewardsLeft = await this._callNum('getRewardsLeft', [assetAddress])
    const r = assetBalance - assetDAO.removeDecimals(rewardsLeft)
    return r < 0 ? 0 : r
  }

  async getSymbol() {
    const assetDAO = await this.getAssetDAO()
    return assetDAO.getSymbol()
  }

  async getRewardsFor (account: string) {
    const assetDAO = await this.getAssetDAO()
    const assetAddress = await assetDAO.getAddress()
    const r = await this._callNum('rewardsFor', [assetAddress, account])
    return assetDAO.removeDecimals(r)
  }

  /** @returns {RewardsModel} */
  async getRewardsData (account) {
    const timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    return Promise.all([
      this.getAddress(), // 0
      this.getSymbol(), // 1
      this.getPeriodLength(), // 2
      this.getLastPeriod(), // 3
      this.getLastClosedPeriod(), // 4
      timeHolderDAO.getAccountDepositBalance(account), // 5
      timeDAO.totalSupply(), // 6
      this.getPeriods(account), // 7
      this.getCurrentAccumulated(), // 8
      this.getRewardsFor(account), // 9
    ]).then(values => {
      return new RewardsModel({
        address: values[0],
        symbol: values[1],
        periodLength: values[2],
        lastPeriod: values[3],
        lastClosedPeriod: values[4],
        accountDeposit: values[5],
        timeTotalSupply: values[6],
        periods: values[7],
        currentAccumulated: values[8],
        accountRewards: values[9]
      })
    })
  }

  /** @returns {Promise<Immutable.Map>} */
  getPeriods (account) {
    return this._callNum('periodsLength').then(length => {
      const promises = []
      for (let i = 0; i < length; i++) {
        promises.push(this._getPeriod(i, account))
      }
      let map = new Immutable.Map()
      return Promise.all(promises).then(values => {
        for (let j = values.length - 1; j >= 0; j--) {
          const period: RewardsPeriodModel = values[j]
          map = map.set(period.id(), period)
        }
        return map
      })
    })
  }

  /**
   * @param id
   * @param account
   * @returns {Promise<RewardsPeriodModel>}
   * @private
   */
  async _getPeriod (id, account) {
    const periodLength = await this.getPeriodLength()
    const values = await Promise.all([
      this.getTotalDepositInPeriod(id),
      this.getDepositBalanceInPeriod(account, id),
      this.getPeriodClosedState(id),
      this.getAssetBalanceInPeriod(id),
      this._callNum('periodUnique', [id]),
      this._callNum('getPeriodStartDate', [id])
    ])
    return new RewardsPeriodModel({
      id,
      totalDeposit: values[0],
      userDeposit: values[1],
      isClosed: values[2],
      assetBalance: values[3],
      uniqueShareholders: values[4],
      startDate: values[5],
      periodLength
    })
  }

  async withdrawRewardsFor (account) {
    const amount = await this.getRewardsFor(account)
    const assetDAO = await this.getAssetDAO()
    const assetAddress = await assetDAO.getAddress()
    return this._tx(TX_WITHDRAW_REWARD, [assetAddress, assetDAO.addDecimals(amount)], {amount})
  }

  closePeriod () {
    return this._tx(TX_CLOSE_PERIOD)
  }

  async watchPeriodClosed (callback) {
    return this._watch('PeriodClosed', () => {
      callback()
    })
  }
}
