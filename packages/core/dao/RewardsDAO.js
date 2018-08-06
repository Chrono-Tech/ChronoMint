/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import type ERC20DAO from './ERC20DAO'
import Amount from '../models/Amount'
import AssetModel from '../models/assetHolder/AssetModel'
import AssetsCollection from '../models/assetHolder/AssetsCollection'
import RewardsPeriodModel from '../models/rewards/RewardsPeriodModel'
import tokenService from '../services/TokenService'
import { MultiEventsHistoryABI, RewardsABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

//#region CONSTANTS

import {
  EE_REWARDS_ERROR,
  EE_REWARDS_PERIOD,
  EE_REWARDS_PERIOD_CLOSED,
  TX_CLOSE_PERIOD,
  TX_WITHDRAW_REWARD,
} from './constants/RewardsDAO'

//#endregion CONSTANTS

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
    for (let i = 0; i < count; i++) {
      this.fetchPeriod(i, asset, account)
    }
  }

  async getAssetDAO (): Promise<ERC20DAO> {
    const addresses = await this._call('getAssets')
    return tokenService.getDAO(addresses[ 0 ])
  }

  getPeriodLength (): Promise {
    return this._callNum('periodsLength')
  }

  getLastPeriod (): Promise {
    return this._callNum('lastPeriod')
  }

  getRewardsLeft (address): Promise {
    return this._call('getRewardsLeft', [ address ])
  }

  getRewardsFor (account, asset: AssetModel): Promise<BigNumber> {
    return this._call('rewardsFor', [ asset.id(), account ])
  }

  /** @private */
  async fetchPeriod (id, asset: AssetModel, account): Promise<RewardsPeriodModel> {
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

  async withdraw (account, asset: AssetModel) {
    const amount = await this.getRewardsFor(account)
    return this._tx(TX_WITHDRAW_REWARD, [
      asset.id(),
      amount,
    ], {
      amount: new Amount(amount, asset.symbol()),
    })
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
    return this._watch('PeriodClosed', () => {
      this.emit(EE_REWARDS_PERIOD_CLOSED)
    })
  }

  async watchError () {
    return this._watch('Error', (result) => {
      this.emit(EE_REWARDS_ERROR, +result.errorCode)
    }, { self: this.getInitAddress() })
  }
}
