import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import TokenModel from './TokenModel'

export default class TokensCollection extends abstractFetchingCollection({
  // default collection
}) {
  getBySymbol (symbol: string) {
    let resultItem = null
    this.items().some((item: TokenModel) => {
      if (item.symbol() === symbol) {
        resultItem = item
        return true
      }
    })
    return resultItem
  }
}
