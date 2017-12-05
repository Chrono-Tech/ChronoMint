import { abstractFetchingCollection } from 'models/AbstractFetchingCollection'

export default class VotingCollection extends abstractFetchingCollection({
  voteLimitInTIME: null,
}) {
  voteLimitInTIME (value) {
    return this._getSet('voteLimitInTIME', value)
  }
}
