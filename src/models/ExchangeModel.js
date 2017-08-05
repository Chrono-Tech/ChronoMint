import { abstractFetchingModel } from './AbstractFetchingModel'
import { ExchangeDAO } from 'dao/ExchangeDAO'

export default class ExchangeModel extends abstractFetchingModel({
  dao: null,
  symbol: null
}) {

  dao (): ExchangeDAO {
    return this.get('dao')
  }

  address (): string {
    return this.dao().getInitAddress()
  }

  symbol (): string {
    return this.get('symbol')
  }

  setSymbol (v): ExchangeModel {
    return this.set('symbol', v)
  }
}
