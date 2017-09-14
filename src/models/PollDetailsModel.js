import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import moment from 'moment'
import { abstractFetchingModel } from './AbstractFetchingModel'

export default class PollDetailsModel extends abstractFetchingModel({
  poll: null,
  votes: Immutable.List(),
  statistics: Immutable.List(),
  memberVote: null,
  timeDAO: null,
  totalSupply: new BigNumber(0),
  shareholdersCount: new BigNumber(0),
  files: Immutable.List()
}) {

  poll () {
    return this.get('poll')
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

  addDecimals (amount: BigNumber): BigNumber {
    return this.get('timeDAO').addDecimals(amount)
  }

  removeDecimals (amount: BigNumber): BigNumber {
    return this.get('timeDAO').removeDecimals(amount)
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
    const options = poll.options()
    const files = this.files()
    const active = poll.active()
    const status = poll.status()
    const daysTotal = moment(endDate).diff(moment(published), 'days')
    const daysLeft = moment(endDate).diff(moment(), 'days')
    const received = this.votes().reduce((total, v) => total.add(v), new BigNumber(0))
    const totalSupply = this.totalSupply()
    const memberVote = this.memberVote()
    const votedCount = this.statistics().reduce((count, v) => count.add(v), new BigNumber(0))
    const shareholdersCount = this.shareholdersCount()
    const percents = shareholdersCount.equals(new BigNumber(0))
      ? 0
      : votedCount.mul(100).div(shareholdersCount).round(0)

    return {
      endDate,
      published,
      voteLimit: voteLimitInTIME && this.addDecimals(voteLimitInTIME),
      voteLimitInTIME,
      memberVote,
      options,
      files,
      active,
      status,
      daysLeft,
      daysTotal,
      received: received.equals(new BigNumber(0))
        ? new BigNumber(0)
        : this.removeDecimals(received),
      totalSupply,
      votedCount,
      shareholdersCount,
      percents
    }
  }
}
