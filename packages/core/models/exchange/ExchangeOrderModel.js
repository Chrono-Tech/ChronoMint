/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class ExchangeOrderModel extends abstractFetchingModel({
  owner: null,
  buyPrice: new BigNumber(0),
  sellPrice: new BigNumber(0),
  assetBalance: new BigNumber(0),
  ethBalance: new BigNumber(0),
  symbol: null,
  address: null,
  authorizedManager: null,
  isActive: true,
  asset: null,
}) {

  id () {
    return this.get('transactionHash') || this.get('address')
  }

  asset (value): string {
    return this._getSet('asset', value)
  }

  address (): string {
    return this.get('address')
  }

  owner (value): string {
    return this._getSet('owner', value)
  }

  buyPrice (value): BigNumber {
    return this._getSet('buyPrice', value)
  }

  sellPrice (value): BigNumber {
    return this._getSet('sellPrice', value)
  }

  assetBalance (value): BigNumber {
    return this._getSet('assetBalance', value)
  }

  ethBalance (value): BigNumber {
    return this._getSet('ethBalance', value)
  }

  symbol (value): string {
    return this._getSet('symbol', value)
  }

  authorizedManager (value): string {
    return this._getSet('authorizedManager', value)
  }

  isActive (value): string {
    return this._getSet('isActive', value)
  }

  isNew () {
    return !this.address()
  }

  // noinspection JSUnusedGlobalSymbols
  txSummary () {
    return {
      symbol: this.symbol(),
      buyPrice: `${this.buyPrice()} ETH`,
      sellPrice: `${this.sellPrice()} ETH`,
      isActive: this.isActive(),
    }
  }
}
