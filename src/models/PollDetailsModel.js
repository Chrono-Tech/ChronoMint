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

  shareholdersCount () {
    return this.get('shareholdersCount')
  }

  voteEntries () {
    const options = this.get('poll').options()
    const votes = this.get('votes')
    return options.zipWith((option) => {
      return { option, count: votes.get(option, new BigNumber(0)) }
    })
  }

  details () {
    const poll = this.get('poll')
    const endDate = poll.deadline()
    const published = poll.published()
    const voteLimitInTIME = poll.voteLimitInTIME()
    const maxOptionTime = this.votes().max((a, b) => a > b)
    const received = this.votes().reduce((total, v) => total.add(v), new BigNumber(0))
    const votedCount = this.statistics().reduce((count, v) => count.add(v), new BigNumber(0))
    const shareholdersCount = this.shareholdersCount()
    const percents = (maxOptionTime || new BigNumber(0)).mul(100).div(voteLimitInTIME).round(0)
    const memberOption = poll.memberOption()

    return {
      endDate,
      published,
      voteLimit: voteLimitInTIME,
      voteLimitInTIME,
      options: poll.options(),
      files: this.files(),
      active: poll.active(),
      status: poll.status(),
      daysLeft: Math.max(moment(endDate).diff(moment(0, 'HH'), 'days'), 0),
      daysTotal: Math.max(moment(endDate).diff(moment({
        y: published.getFullYear(),
        M: published.getMonth(),
        d: published.getDate(),
      }), 'days'), 0),
      received,
      totalSupply: this.totalSupply(),
      votedCount,
      shareholdersCount,
      percents: percents.gt(100) ? new BigNumber(100) : percents,
      maxOptionTime: maxOptionTime || new BigNumber(0),
      memberOption: memberOption && memberOption.toNumber(),
    }
  }
}
