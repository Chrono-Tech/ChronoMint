import {Map} from 'immutable'
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
    return require('../contracts/Rewards.json')
  }

  constructor (at = null) {
    super(RewardsDAO.getJson(), at)
  }

  static getContractModel () {
    return RewardsContractModel
  }

  /** @return {Promise.<RewardsContractModel>} */
  initContractModel () {
    const Model = RewardsDAO.getContractModel()
    return this.getAddress().then(address => new Model(address))
  }

  getPeriodLength () {
    return this.contract.then(deployed => deployed.closeInterval.call().then(r => r.toNumber()))
  };

  getLastPeriod () {
    return this.contract.then(deployed => deployed.lastPeriod.call().then(r => r.toNumber()))
  };

  getLastClosedPeriod () {
    return this.contract.then(deployed => deployed.lastClosedPeriod.call()
      .then(r => r.toNumber())
      .catch(() => 0) // no closed periods yet
    )
  };

  getDepositBalanceInPeriod (address: string, periodId: number) {
    return this.contract.then(deployed => deployed.depositBalanceInPeriod(address, periodId).then(r => r.toNumber()))
  };

  getAssetBalanceInPeriod (periodId: number) {
    return LHTProxyDAO.getAddress().then(address =>
      this.contract.then(deployed =>
        deployed.assetBalanceInPeriod(address, periodId).then(r => r.toNumber()))
    )
  }

  /** @return {boolean} */
  getPeriodClosedState (periodId: number) {
    return this.contract.then(deployed =>
      deployed.isClosed(periodId)
        .then(r => r)
        .catch(() => false) // no closed periods yet
    )
  };

  getCurrentAccumulated () {
    return this.getAddress().then(address =>
      LHTProxyDAO.getAccountBalance(address).then(lhBalance =>
        LHTProxyDAO.getAddress().then(lhAddress =>
          this.contract.then(deployed =>
            deployed.rewardsLeft.call(lhAddress).then(rewardsLeft =>
              lhBalance - rewardsLeft.toNumber()
            )))))
  }

  getRewardsFor (address: string) {
    return this.contract.then(deployed =>
      LHTProxyDAO.getAddress().then(lhAddress =>
        deployed.rewardsFor.call(lhAddress, address).then(rewards =>
          rewards.toNumber()
        )))
  }

  /** @return {RewardsModel} */
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

  /** @return {Promise.<Immutable.Map>} */
  getPeriods (account) {
    return new Promise(resolve => {
      this.contract.then(deployed => {
        deployed.periodsLength.call().then(length => {
          length = length.toNumber()
          const promises = []
          for (let i = 0; i < length; i++) {
            promises.push(this._getPeriod(i, account))
          }
          let map = new Map()
          Promise.all(promises).then(values => {
            for (let j = values.length - 1; j >= 0; j--) {
              /** @type RewardsPeriodModel */
              const period = values[j]
              map = map.set(period.id(), period)
            }
            resolve(map)
          })
        })
      })
    })
  }

  /**
   * @param id
   * @param account
   * @return {Promise.<RewardsPeriodModel>}
   * @private
   */
  _getPeriod (id, account) {
    return new Promise((resolve, reject) => {
      this.contract.then(deployed => {
        this.getPeriodLength().then(periodLength => {
          deployed.periods.call(id)
            .then(r => {
              Promise.all([
                this.getDepositBalanceInPeriod(account, id),
                this.getPeriodClosedState(id),
                this.getAssetBalanceInPeriod(id)
              ]).then(values => {
                resolve(new RewardsPeriodModel({
                  id,
                  startDate: r[0].toNumber(),
                  totalDeposit: r[1].toNumber(),
                  uniqueShareholders: r[2].toNumber(),
                  userDeposit: values[0],
                  isClosed: values[1],
                  assetBalance: values[2],
                  periodLength
                }))
              })
            })
            .catch(e => reject(e))
        })
      })
    })
  }

  withdrawRewardsFor (address) {
    return this.getRewardsFor(address).then(amount =>
      LHTProxyDAO.getAddress().then(lhAddress =>
        this.contract.then(deployed =>
          deployed.withdrawReward(lhAddress, amount, {from: address, gas: 3000000}))))
  }

  closePeriod (address) {
    const params = {from: address, gas: 3000000}
    return this.contract.then(deployed =>
      LHTProxyDAO.getAddress().then(lhAddress =>
        deployed.closePeriod(params).then(() =>
          deployed.registerAsset(lhAddress, params).then(() =>
            deployed.calculateReward(lhAddress, params)
        ))))
  }
}

export default new RewardsDAO()
