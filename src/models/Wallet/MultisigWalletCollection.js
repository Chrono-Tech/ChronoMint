import { abstractFetchingModel } from '../AbstractFetchingModel'
import Immutable from 'immutable'

export default class MultisigWalletCollection extends abstractFetchingModel({
  list: new Immutable.Map(),
  selected: null, // address
}) {
  list (value) {
    return this._getSet('list', value)
  }

  selected (value) {
    if (value === undefined) {
      return this.list().get(this.get('selected'))
    } else {
      return this.set('selected', value)
    }
  }

  hasSelected () {
    return !!this.get('selected')
  }
}
