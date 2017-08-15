import Immutable from 'immutable'
import { abstractFetchingModel } from './AbstractFetchingModel'

export default class PollDetailsModel extends abstractFetchingModel({
  poll: null,
  votes: Immutable.List()
}) {

  poll () {
    return this.get('poll')
  }

  votes () {
    return this.get('votes')
  }

  voteEntries () {
    const options = this.get('poll').options()
    const votes = this.get('votes')

    return options.zipWith((option, total) => ({ option, total }), votes)
  }
}
