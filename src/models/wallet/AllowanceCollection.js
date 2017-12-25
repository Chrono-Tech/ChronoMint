import AllowanceModel from './AllowanceModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class AllowanceCollection extends abstractFetchingCollection({
  emptyModel: new AllowanceModel(),
}) {
  item (spender, tokenId) {
    return this.list().get(`${spender}-${tokenId}`) || this.emptyModel()
  }
}
