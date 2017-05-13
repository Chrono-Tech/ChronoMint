import { Map } from 'immutable'
import AbstractOtherContractDAO from './AbstractOtherContractDAO'
import TIMEHolderDAO from './TIMEHolderDAO'
import TIMEProxyDAO from './TIMEProxyDAO'
import LHTProxyDAO from './LHTProxyDAO'
import RewardsModel from '../models/RewardsModel'
import RewardsPeriodModel from '../models/RewardsPeriodModel'
import RewardsContractModel from '../models/contracts/RewardsContractModel'

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
    return this._call('closeInterval').then(r => r.toNumber())
  }

  getLastPeriod () {
    return this._call('lastPeriod').then(r => r.toNumber())
  }

  getLastClosedPeriod () {
    return this._call('lastClosedPeriod').then(r => r.toNumber())
      .catch(() => 0) // no closed periods yet
  }

  getDepositBalanceInPeriod (address: string, periodId: number) {
    return this._call('depositBalanceInPeriod', [address, periodId]).then(r => r.toNumber())
  }

  getAssetBalanceInPeriod (periodId: number) {
    return LHTProxyDAO.getAddress().then(address =>
      this._call('assetBalanceInPeriod', [address, periodId]).then(r => r.toNumber())
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
          this._call('rewardsLeft', [lhAddress]).then(rewardsLeft =>
            lhBalance - rewardsLeft.toNumber()
          ))))
  }

  getRewardsFor (account: string) {
    LHTProxyDAO.getAddress().then(lhAddress =>
      this._call('rewardsFor', [lhAddress, account]).then(r => r.toNumber))
  }

  /** @returns {RewardsModel} */
  getData (account) {
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
    return this._call('periodsLength').then(length => {
      length = length.toNumber()
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
            totalDeposit: r[1].toNumber(),
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
        this._tx('withdrawReward', [lhAddress, amount])))
  }

  closePeriod () {
    LHTProxyDAO.getAddress().then(lhAddress =>
      this._tx('closePeriod').then(() =>
        this._tx('registerAsset', [lhAddress]).then(() =>
          this._tx('calculateReward', [lhAddress]))))
  }
}

export default new RewardsDAO()
