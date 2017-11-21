import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class ExchangesCollection extends abstractFetchingCollection({
  // defaults
}) {
  concat (collection: ExchangesCollection) {
    return this.list(this.list().concat(collection.list()))
  }
}
