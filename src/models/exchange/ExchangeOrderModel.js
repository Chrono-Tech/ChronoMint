// TODO @bshevchenko: this is intermediate version for demo
import BigNumber from 'bignumber.js'

import { abstractNoticeModel } from 'models/notices/AbstractNoticeModel'

export default class ExchangeOrderModel extends abstractNoticeModel({
  owner: null,
  buyPrice: new BigNumber(0),
  sellPrice: new BigNumber(0),
  assetBalance: new BigNumber(0),
  ethBalance: new BigNumber(0),
  symbol: null,
  address: null,
  authorizedManager: null,
  isActive: false,
}) {

  id (value) {
    return this._getSet('address', value)
  }

  address (value): string {
    return this._getSet('address', value)
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
}
