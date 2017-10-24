import { abstractFetchingModel } from '../AbstractFetchingModel'
import Immutable from 'immutable'
import { TXS_PER_PAGE } from 'dao/AbstractTokenDAO'

export default class MainWallet extends abstractFetchingModel({
  list: new Immutable.Map(),
  endOfList: false
}) {
  list (value) {
    return this._getSet('list', value)
  }

  endOfList (value) {
    return this._getSet('endOfList', value < TXS_PER_PAGE)
  }
}
