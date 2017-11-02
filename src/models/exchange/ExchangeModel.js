import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import { abstractFetchingModel } from 'models/AbstractFetchingModel'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'

export default class ExchangeModel extends abstractFetchingModel({
  orders: new Immutable.List([
    new ExchangeOrderModel({
      trader: '0xefadef49b8980cbd9bbe0b46769b83356452f491',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: true,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
    new ExchangeOrderModel({
      trader: '0xefadef49b8980cbd9bbe0b46769b83356452f491',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: true,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
    new ExchangeOrderModel({
      trader: '0xefadef49b8980cbd9bbe0b46769b83356452f491',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: false,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
    new ExchangeOrderModel({
      trader: '0xefadef49b8980cbd9bbe0b46769b83356452f491',
      buyPrice: new BigNumber(123),
      sellPrice: new BigNumber(123),
      isBuy: true,
      limits: new BigNumber(1512000),
      symbol: 'ETH',
    }),
    new ExchangeOrderModel({
      trader: '0xefadef49b8980cbd9bbe0b46769b83356452f491',
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
