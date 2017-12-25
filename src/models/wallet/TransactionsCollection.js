import TxModel from 'models/TxModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export const TXS_PER_PAGE = 10

export default class TransactionsCollection extends abstractFetchingCollection({
  endOfList: false,
  emptyModel: new TxModel(),
}) {
  endOfList (value) {
    return this._getSet('endOfList', value < TXS_PER_PAGE)
  }
}
