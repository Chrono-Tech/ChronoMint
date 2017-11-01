import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import { abstractFetchingModel } from 'models/AbstractFetchingModel'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'

export default class ExchangeModel extends abstractFetchingModel({
  orders: new Immutable.List([
    new ExchangeOrderModel({
      trader: 'Trader name 1',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: true,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
    new ExchangeOrderModel({
      trader: 'Trader name 1',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: true,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
    new ExchangeOrderModel({
      trader: 'Trader name 1',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: false,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
    new ExchangeOrderModel({
      trader: 'Trader name 1',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: true,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
    new ExchangeOrderModel({
      trader: 'Trader name 1',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: false,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
  ]),
}) {
  orders (value) {
    return this._getSet('orders', value)
  }
}
