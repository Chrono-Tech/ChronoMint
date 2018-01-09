import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import moment from 'moment'
import { abstractFetchingModel } from './AbstractFetchingModel'
import PollModel from './PollModel'

export default class PollDetailsModel extends abstractFetchingModel({
  id: null,
  poll: new PollModel(),
  votes: Immutable.List(),
  statistics: Immutable.List(),
  memberVote: null,
  totalSupply: new BigNumber(0),
  shareholdersCount: new BigNumber(0),
  files: Immutable.List(),
}) {
  id () {
    return this.get('transactionHash') || this.get('id')
  }

  poll (value) {
    return this._getSet('poll', value)
  }

  votes () {
    return this.get('votes')
  }

  files () {
    return this.get('files')
  }

  statistics () {
    return this.get('statistics')
  }

  totalSupply () {
    return this.get('totalSupply')
  }

  memberVote () {
    return this.get('memberVote')
  }

  shareholdersCount () {
    return this.get('shareholdersCount')
  }

  voteEntries () {
    const options = this.get('poll').options()
    const votes = this.get('votes')
    const statistics = this.get('statistics')

    return options.zipWith((option, total, count) => ({ option, total, count }), votes, statistics)
  }

  details () {
    const poll = this.get('poll')
    const endDate = poll.deadline()
    const published = poll.published()
    const voteLimitInTIME = poll.voteLimitInTIME()
    const received = this.votes().reduce((total, v) => total.add(v), new BigNumber(0))
    const votedCount = this.statistics().reduce((count, v) => count.add(v), new BigNumber(0))
    const shareholdersCount = this.shareholdersCount()
    const percents = shareholdersCount.equals(new BigNumber(0))
      ? 0
      : votedCount.mul(100).div(shareholdersCount).round(0)

    return {
      endDate,
      published,
      voteLimit: voteLimitInTIME,
      voteLimitInTIME,
      memberVote: this.memberVote(),
      options: poll.options(),
      files: this.files(),
      active: poll.active(),
      status: poll.status(),
      daysLeft: Math.max(moment(endDate).diff(moment(), 'days'), 0),
      daysTotal: Math.max(moment(endDate).diff(moment(published), 'days'), 0),
      received,
      totalSupply: this.totalSupply(),
      votedCount,
      shareholdersCount,
      percents,
    }
  }
}
