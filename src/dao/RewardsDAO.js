import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import RewardsModel from 'models/RewardsModel'
import RewardsPeriodModel from 'models/RewardsPeriodModel'
import contractsManagerDAO from './ContractsManagerDAO'
import resultCodes from 'chronobank-smart-contracts/common/errors'

export const TX_WITHDRAW_REWARD = 'withdrawReward'
export const TX_CLOSE_PERIOD = 'closePeriod'

export default class RewardsDAO extends AbstractContractDAO {
  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/Rewards.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )

    // TODO @bshevchenko: MINT-279
    /** @namespace resultCodes.REWARD_CALCULATION_FAILED */
    this._okCodes = [resultCodes.OK, resultCodes.REWARD_CALCULATION_FAILED]
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

  async getDepositBalanceInPeriod (account, periodId: number): BigNumber {
    const balance = await this._call('depositBalanceInPeriod', [account, periodId])
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    return timeDAO.removeDecimals(balance)
  }

  async getAssetBalanceInPeriod (periodId: number): BigNumber {
    const assetDAO = await this.getAssetDAO()
    const assetAddress = await assetDAO.getAddress()
    const balance = await this._call('assetBalanceInPeriod', [assetAddress, periodId])
    return assetDAO.removeDecimals(balance)
  }

  /** @returns {boolean} */
  getPeriodClosedState (id: number) {
    return this._call('isClosed', [id])
      .catch(() => false) // no closed periods yet
      .then(r => r)
  }

  async getTotalDepositInPeriod (id: number): BigNumber {
    const deposit = await this._call('totalDepositInPeriod', [id])
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    return timeDAO.removeDecimals(deposit)
  }

  async getCurrentAccumulated (): BigNumber {
    const address = await this.getAddress()
    const assetDAO = await this.getAssetDAO()
    const assetBalance = await assetDAO.getAccountBalance('latest', address)
    const assetAddress = await assetDAO.getAddress()
    const rewardsLeft = await this._call('getRewardsLeft', [assetAddress])
    const r = assetBalance.minus(assetDAO.removeDecimals(rewardsLeft))
    return r.lt(0) ? new BigNumber(0) : r
  }

  async getSymbol () {
    const assetDAO = await this.getAssetDAO()
    return assetDAO.getSymbol()
  }

  async getRewardsFor (account): BigNumber {
    const assetDAO = await this.getAssetDAO()
    const assetAddress = await assetDAO.getAddress()
    const r = await this._call('rewardsFor', [assetAddress, account])
    return assetDAO.removeDecimals(r)
  }

  async getRewardsData (): RewardsModel {
    const timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    return Promise.all([
      this.getAddress(), // 0
      this.getSymbol(), // 1
      this.getPeriodLength(), // 2
      this.getLastPeriod(), // 3
      this.getLastClosedPeriod(), // 4
      timeHolderDAO.getAccountDepositBalance(), // 5
      timeDAO.totalSupply(), // 6
      this.getPeriods(this.getAccount()), // 7
      this.getCurrentAccumulated(), // 8
      this.getRewardsFor(this.getAccount()), // 9
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

  async getPeriods (account): Immutable.Map<RewardsPeriodModel> {
    const length = await this._callNum('periodsLength')
    const promises = []
    for (let i = 0; i < length; i++) {
      promises.push(this._getPeriod(i, account))
    }
    const values = await Promise.all(promises)

    let map = new Immutable.Map()
    for (let j = values.length - 1; j >= 0; j--) {
      const period: RewardsPeriodModel = values[j]
      map = map.set(period.id(), period)
    }
    return map
  }

  /** @private */
  async _getPeriod (id, account): Promise<RewardsPeriodModel> {
    const periodLength = await this.getPeriodLength()
    const values = await Promise.all([
      this.getTotalDepositInPeriod(id), // 0
      this.getDepositBalanceInPeriod(account, id), // 1
      this.getPeriodClosedState(id), // 2
      this.getAssetBalanceInPeriod(id), // 3
      this._callNum('periodUnique', [id]), // 4
      this._callNum('getPeriodStartDate', [id]) // 5
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

  async withdraw () {
    const [amount, assetDAO] = await Promise.all([
      await this.getRewardsFor(this.getAccount()),
      await this.getAssetDAO()
    ])
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
