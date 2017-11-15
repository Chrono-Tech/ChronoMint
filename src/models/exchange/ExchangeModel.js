import Immutable from 'immutable'
import { abstractFetchingModel } from 'models/AbstractFetchingModel'
import ExchangesCollection from './ExchangesCollection'
import TokensCollection from './TokensCollection'

export default class ExchangeModel extends abstractFetchingModel({
  exchanges: new ExchangesCollection(),
  assetSymbols: [],
  filter: new Immutable.Map(),
  tokens: new TokensCollection(),
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

  tokens (value) {
    return this._getSet('tokens', value)
  }
}
