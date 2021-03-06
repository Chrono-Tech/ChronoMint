/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import AbstractModel from './AbstractModel'
import Amount from '../../core/models/Amount'
import PollModel from './PollModel'

const schemaFactory = () => ({
  id: PropTypes.string,
  poll: PropTypes.instanceOf(PollModel),
  votes: PropTypes.instanceOf(Immutable.Map),
  statistics: PropTypes.instanceOf(Immutable.List),
  totalSupply: PropTypes.instanceOf(BigNumber),
  shareholdersCount: PropTypes.instanceOf(BigNumber),
  files: PropTypes.instanceOf(Immutable.List),
  isFetched: PropTypes.bool,
  isFetching: PropTypes.bool,
})

class PollDetailsModel extends AbstractModel {
  constructor (ownProps) {
    const defaultProps = {
      id: null,
      poll: new PollModel(),
      votes: Immutable.Map(),
      statistics: Immutable.List(),
      totalSupply: new BigNumber(0),
      shareholdersCount: new BigNumber(0),
      files: Immutable.List(),
      isFetched: false,
      isFetching: false,
    }
    const props = { ...defaultProps, ...ownProps }
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  id (value) {
    if (value) {
      return new PollDetailsModel({ ...this, id: value, poll: new PollModel({ ...this.poll, id: value }) })
    }

    return this.id
  }

  voteEntries () {
    const options = this.poll.options
    const votes = this.votes

    return options.map((option, key) => {
      return { option, count: votes.get(`${key + 1}`, new Amount(0, 'TIME')) }
    })
  }

  details () {
    const poll = this.poll
    const endDate = poll.deadline
    const published = poll.published
    const voteLimitInTIME = poll.voteLimitInTIME
    const maxOptionTime = this.votes.max((a, b) => a.gt(b))
    const received = new Amount(this.votes.reduce((total, v) => total.add(v), new BigNumber(0)), 'TIME')
    const votedCount = this.statistics.reduce((count, v) => count.add(v), new BigNumber(0))
    const shareholdersCount = new BigNumber(this.shareholdersCount)
    const percents = voteLimitInTIME
      ? (maxOptionTime || new BigNumber(0)).mul(100).div(voteLimitInTIME).round(0)
      : new BigNumber(100)
    const memberOption = poll.memberOption
    const id = this.id
    const title = poll.title
    const description = poll.description
    const isFetched = this.isFetched
    const isFetching = this.isFetching
    const hasMember = poll.hasMember
    const voteEntries = this.voteEntries()
    const owner = poll.owner

    return {
      id,
      isFetched,
      isFetching,
      owner,
      title,
      description,
      hasMember,
      endDate,
      published,
      voteLimitInTIME,
      options: poll.options,
      files: this.files,
      active: poll.active,
      status: poll.status,
      daysLeft: Math.max(moment(endDate).diff(moment(0, 'HH'), 'days'), 0),
      daysTotal: Math.max(moment(endDate).diff(moment({
        y: published.getFullYear(),
        M: published.getMonth(),
        d: published.getDate(),
      }), 'days'), 0),
      received,
      totalSupply: this.totalSupply,
      votedCount,
      shareholdersCount,
      percents: percents.gt(100) ? new BigNumber(100) : percents,
      maxOptionTime: maxOptionTime || new Amount(0, 'TIME'),
      memberOption: memberOption && memberOption.toNumber(),
      voteEntries,
    }
  }
}

export default PollDetailsModel
