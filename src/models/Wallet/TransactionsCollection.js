import { TXS_PER_PAGE } from 'dao/AbstractTokenDAO'

import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class MainWallet extends abstractFetchingCollection({
  endOfList: false,
}) {
  endOfList (value) {
    return this._getSet('endOfList', value < TXS_PER_PAGE)
  }
}
