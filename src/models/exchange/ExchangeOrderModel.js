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
  isActive: false,
}) {

  id () {
    return this.get('transactionHash') || this.get('address')
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
}
