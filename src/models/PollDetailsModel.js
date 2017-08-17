import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import moment from 'moment'
import { abstractFetchingModel } from './AbstractFetchingModel'

export default class PollDetailsModel extends abstractFetchingModel({
  poll: null,
  votes: Immutable.List(),
  statistics: Immutable.List(),
  timeDAO: null,
  totalSupply: null,
  shareholdersCount: null
}) {

  poll () {
    return this.get('poll')
  }

  votes () {
    return this.get('votes')
  }

  statistics () {
    return this.get('statistics')
  }

  totalSupply () {
    return this.get('totalSupply')
  }

  shareholdersCount () {
    return this.get('shareholdersCount')
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
    const voteLimit = poll.voteLimit()
    const options = poll.options()
    const files = poll.files()
    const active = poll.active()
    const status = poll.status()
    const daysTotal = moment(endDate).diff(moment(published), 'days')
    const daysLeft = moment(endDate).diff(moment(), 'days')
    const received = this.removeDecimals(this.votes().reduce((total, v) => total.add(v), new BigNumber(0)))
    const totalSupply = this.totalSupply()
    const votedCount = this.statistics().reduce((count, v) => count.add(v), new BigNumber(0))
    const shareholdersCount = this.shareholdersCount()
    console.log('votedCount, shareholdersCount', votedCount.toNumber(), shareholdersCount.toNumber())
    const percents = votedCount.mul(100).div(shareholdersCount).round(0)

    return {
      endDate,
      published,
      voteLimit,
      options,
      files,
      active,
      status,
      daysLeft,
      daysTotal,
      received,
      totalSupply,
      votedCount,
      shareholdersCount,
      percents
    }
  }
}
