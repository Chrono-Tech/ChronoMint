import Immutable from 'immutable'
import { abstractFetchingModel } from 'models/AbstractFetchingModel'
import ExchangesCollection from './ExchangesCollection'

export default class ExchangeModel extends abstractFetchingModel({
  exchanges: new ExchangesCollection(),
  assetSymbols: [],
  filter: new Immutable.Map(),
}) {
  exchanges (value) {
    return this._getSet('exchanges', value)
  }

  assetSymbols (value) {
    return this._getSet('assetSymbols', value)
  }

  filter (value) {
    return this._getSet('filter', value)
  }
}
