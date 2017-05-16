import { Map } from 'immutable'
import AbstractOtherContractDAO from './AbstractOtherContractDAO'
import TIMEHolderDAO from './TIMEHolderDAO'
import TIMEProxyDAO from './TIMEProxyDAO'
import LHTProxyDAO from './LHTProxyDAO'
import RewardsModel from '../models/RewardsModel'
import RewardsPeriodModel from '../models/RewardsPeriodModel'
import RewardsContractModel from '../models/contracts/RewardsContractModel'

export const TX_WITHDRAW_REWARD = 'withdrawReward'
export const TX_CLOSE_PERIOD = 'closePeriod'

export class RewardsDAO extends AbstractOtherContractDAO {
  static getTypeName () {
    return 'Rewards'
  }

  static getJson () {
    return require('chronobank-smart-contracts/build/contracts/Rewards.json')
  }

  constructor (at = null) {
    super(RewardsDAO.getJson(), at)
  }

  static getContractModel () {
    return RewardsContractModel
  }

  /** @returns {Promise.<RewardsContractModel>} */
  initContractModel () {
    const Model = RewardsDAO.getContractModel()
    return this.getAddress().then(address => new Model(address))
  }

  getPeriodLength () {
    return this._callNum('closeInterval')
  }

  getLastPeriod () {
    return this._callNum('lastPeriod')
  }

  getLastClosedPeriod () {
    return this._callNum('lastClosedPeriod')
      .catch(() => 0) // no closed periods yet
  }

  getDepositBalanceInPeriod (address: string, periodId: number) {
    return this._callNum('depositBalanceInPeriod', [address, periodId]).then(r => r / 100000000)
  }

  getAssetBalanceInPeriod (periodId: number) {
    return LHTProxyDAO.getAddress().then(address =>
      this._callNum('assetBalanceInPeriod', [address, periodId]).then(r => r / 100000000)
    )
  }

  /** @returns {boolean} */
  getPeriodClosedState (periodId: number) {
    return this._call('isClosed', [periodId]).then(r => r)
      .catch(() => false) // no closed periods yet
  }

  getCurrentAccumulated () {
    return this.getAddress().then(address =>
      LHTProxyDAO.getAccountBalance(address).then(lhBalance =>
        LHTProxyDAO.getAddress().then(lhAddress =>
          this._callNum('rewardsLeft', [lhAddress]).then(rewardsLeft =>
            (lhBalance - rewardsLeft) / 100000000
          ))))
  }

  getRewardsFor (account: string) {
    return LHTProxyDAO.getAddress().then(lhAddress =>
      this._callNum('rewardsFor', [lhAddress, account]).then(r => r / 100000000))
  }

  /** @returns {RewardsModel} */
  getRewardsData (account) {
    return Promise.all([
      this.getAddress(), // 0
      this.getPeriodLength(), // 1
      this.getLastPeriod(), // 2
      this.getLastClosedPeriod(), // 3
      TIMEHolderDAO.getAccountDepositBalance(account), // 4
      TIMEProxyDAO.totalSupply(), // 5
      this.getPeriods(account), // 6
      this.getCurrentAccumulated(), // 7
      this.getRewardsFor(account) // 8
    ]).then(values => {
      return new RewardsModel({
        address: values[0],
        periodLength: values[1],
        lastPeriod: values[2],
        lastClosedPeriod: values[3],
        accountDeposit: values[4],
        timeTotalSupply: values[5],
        periods: values[6],
        currentAccumulated: values[7],
        accountRewards: values[8]
      })
    })
  }

  /** @returns {Promise.<Immutable.Map>} */
  getPeriods (account) {
    return this._callNum('periodsLength').then(length => {
      const promises = []
      for (let i = 0; i < length; i++) {
        promises.push(this._getPeriod(i, account))
      }
      let map = new Map()
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
   * @returns {Promise.<RewardsPeriodModel>}
   * @private
   */
  _getPeriod (id, account) {
    return this.getPeriodLength().then(periodLength => {
      return this._call('periods', [id]).then(r => {
        return Promise.all([
          this.getDepositBalanceInPeriod(account, id),
          this.getPeriodClosedState(id),
          this.getAssetBalanceInPeriod(id)
        ]).then(values => {
          return new RewardsPeriodModel({
            id,
            startDate: r[0].toNumber(),
            totalDeposit: r[1].toNumber() / 100000000,
            uniqueShareholders: r[2].toNumber(),
            userDeposit: values[0],
            isClosed: values[1],
            assetBalance: values[2],
            periodLength
          })
        })
      })
    })
  }

  withdrawRewardsFor (account) {
    return this.getRewardsFor(account).then(amount =>
      LHTProxyDAO.getAddress().then(lhAddress =>
        this._tx(TX_WITHDRAW_REWARD, [lhAddress, amount], {amount})))
  }

  closePeriod () {
    return this._tx(TX_CLOSE_PERIOD)
  }
}

export default new RewardsDAO()
