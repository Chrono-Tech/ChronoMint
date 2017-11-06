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
}) {

  address (): string {
    return this.get('address')
  }

  owner (): string {
    return this.get('owner')
  }

  buyPrice (): BigNumber {
    return this.get('buyPrice')
  }

  sellPrice (): BigNumber {
    return this.get('sellPrice')
  }

  assetBalance (): BigNumber {
    return this.get('assetBalance')
  }

  ethBalance (): BigNumber {
    return this.get('ethBalance')
  }

  symbol (): string {
    return this.get('symbol')
  }
}
