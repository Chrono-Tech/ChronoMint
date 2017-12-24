import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import type ERC20DAO from 'dao/ERC20DAO'
import Immutable from 'immutable'
import Amount from 'models/Amount'
import AssetModel from 'models/assetHolder/AssetModel'
import AssetsCollection from 'models/assetHolder/AssetsCollection'
import RewardsModel from 'models/rewards/RewardsModel'
import RewardsPeriodModel from 'models/rewards/RewardsPeriodModel'
import tokenService from 'services/TokenService'
import { MultiEventsHistoryABI, RewardsABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

export const TX_WITHDRAW_REWARD = 'withdrawReward'
export const TX_CLOSE_PERIOD = 'closePeriod'

export const EE_REWARDS_PERIOD = 'rewards/newPeriod'
export const EE_REWARDS_PERIOD_CLOSED = 'rewards/periodClosed'
export const EE_REWARDS_ERROR = 'rewards/error'

export default class RewardsDAO extends AbstractContractDAO {
  constructor (at) {
    super(RewardsABI, at, MultiEventsHistoryABI)
    this._okCodes = [ resultCodes.OK, resultCodes.REWARD_CALCULATION_FAILED ]
  }

  async getAssets (): Promise {
    const assetsAddresses: Array = await this._callArray('getAssets')
    let assets = new AssetsCollection()
    assetsAddresses.forEach((address) => {
      assets = assets.add(new AssetModel({ address }))
    })
    return assets
  }

  fetchPeriods (count, asset: AssetModel, account: string) {
    console.log('--RewardsDAO#fetchPeriods', count, asset, account)
    for (let i = 0; i < count; i++) {
      this._getPeriod(i, asset, account)
    }
  }

  async getAssetDAO (): Promise<ERC20DAO> {
    const addresses = await this._call('getAssets')
    console.log('--RewardsDAO#getAssetDAO', addresses)
    return tokenService.getDAO(addresses[ 0 ])
  }

  getPeriodLength (): Promise {
    return this._callNum('periodsLength')
  }

  getLastPeriod (): Promise {
    return this._callNum('lastPeriod')
  }

  getLastClosedPeriod (): Promise {
    return this._callNum('lastClosedPeriod')
    // .catch(() => 0) // no closed periods yet
  }

  async getAssetBalanceInPeriod (periodId: number): Promise<BigNumber> {
    const assetDAO = await this.getAssetDAO()
    const assetAddress = await assetDAO.getAddress()
    return this._call('assetBalanceInPeriod', [ assetAddress, periodId ])
  }

  async getPeriodClosedState (id: number): Promise<boolean> {
    try {
      return this._call('isClosed', [ id ])
    } catch (e) {
      // no closed periods yet
      return false
    }
  }

  getRewardsLeft (address): Promise {
    return this._call('getRewardsLeft', [ address ])
  }

  // async getCurrentAccumulated (): Promise<BigNumber> {
  //   const address = await this.getAddress()
  //   const assetDAO = await this.getAssetDAO()
  //   const assetBalance = await assetDAO.getAccountBalance(address)
  //   const assetAddress = await assetDAO.getAddress()
  //   const rewardsLeft = await this._call('getRewardsLeft', [ assetAddress ])
  //   const r = assetBalance.minus(assetDAO.removeDecimals(rewardsLeft))
  //   return r.lt(0) ? new BigNumber(0) : r
  // }

  async getRewardsFor (account, asset: AssetModel): Promise<BigNumber> {
    const assetDAO = await this.getAssetDAO()
    const assetAddress = await assetDAO.getAddress()
    const r = await this._call('rewardsFor', [ assetAddress, account ])
    return assetDAO.removeDecimals(r)
  }

  async getRewardsData (account, /* token */): Promise<RewardsModel> {
    const [
      periodLength,
      lastPeriod,
      lastClosedPeriod,
      periods,
      // accountRewards,
    ] = await Promise.all([
      this.getPeriodLength(),
      this.getLastPeriod(),
      this.getLastClosedPeriod(),

      this.getPeriods(account),
      // this.getRewardsFor(account),
    ])

    console.log('--RewardsDAO#getRewardsData', periodLength, lastPeriod, lastClosedPeriod, periods.toJS())

    return {
      // address,
      periodLength,
      lastPeriod,
      lastClosedPeriod,
      periods,
      // currentAccumulated,
      // rewardsLeft,
      // accountRewards,
    }
  }

  async getPeriods (account): Promise<Immutable.Map<RewardsPeriodModel>> {
    const length = await this._callNum('periodsLength')
    const promises = []
    for (let i = 0; i <= length; i++) {
      promises.push(this._getPeriod(i, account))
    }
    const values = await Promise.all(promises)

    let map = new Immutable.Map()
    for (let j = values.length - 1; j >= 0; j--) {
      const period: RewardsPeriodModel = values[ j ]
      map = map.set(period.id(), period)
    }
    return map
  }

  /** @private */
  async _getPeriod (id, asset: AssetModel, account): Promise<RewardsPeriodModel> {
    const values = await Promise.all([
      this._call('totalDepositInPeriod', [ id ]), // 0
      this._call('depositBalanceInPeriod', [ account, id ]), // 1
      this._call('isClosed', [ id ]), // 2
      this._call('assetBalanceInPeriod', [ asset.id(), id ]), // 3
      this._callNum('periodUnique', [ id ]), // 4
      this._callNum('getPeriodStartDate', [ id ]), // 5
      this.getPeriodLength(), // 6
    ])

    this.emit(EE_REWARDS_PERIOD, new RewardsPeriodModel({
      id,
      totalDeposit: new Amount(values[ 0 ], asset.symbol()),
      userDeposit: new Amount(values[ 1 ], asset.symbol()),
      isClosed: values[ 2 ],
      assetBalance: new Amount(values[ 3 ], asset.symbol()),
      uniqueShareholders: values[ 4 ],
      startDate: values[ 5 ],
      periodLength: values [ 6 ],
    }))
  }

  async withdraw () {
    const [ amount, assetDAO ] = await Promise.all([
      await this.getRewardsFor(this.getAccount()),
      await this.getAssetDAO(),
    ])
    const assetAddress = await assetDAO.getAddress()
    return this._tx(TX_WITHDRAW_REWARD, [ assetAddress, assetDAO.addDecimals(amount) ], { amount })
  }

  async closePeriod () {
    return this._tx(TX_CLOSE_PERIOD)
  }

  watch (): Promise {
    return Promise.all([
      this.watchPeriodClosed(),
      this.watchError(),
    ])
  }

  async watchPeriodClosed () {
    return this._watch('PeriodClosed', (result) => {
      this.emit(EE_REWARDS_PERIOD_CLOSED, result)
    })
  }

  async watchError () {
    return this._watch('Error', (result) => {
      this.emit(EE_REWARDS_ERROR, result)
    }, { self: this.getInitAddress() })
  }
}
