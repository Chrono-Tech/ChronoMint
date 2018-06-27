/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Poll } from 'components'
import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router'
import { getPollsDetailsList, getVotingFlags } from '@chronobank/core/redux/voting/selectors'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { listPolls } from '@chronobank/core/redux/voting/actions'
import { isCBE } from '@chronobank/core/redux/session/selectors'
import { getDepositAmount } from '@chronobank/core/redux/assetsHolder/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { prefix } from './lang'

import './VotingContent.scss'

function makeMapStateToProps () {
  const getPolls = getPollsDetailsList()
  const getIsCBE = isCBE()
  const getFlags = getVotingFlags()
  const getDeposit = getDepositAmount()

  const mapStateToProps = (ownState) => {
    return {
      polls: getPolls(ownState),
      deposit: getDeposit(ownState),
      isCBE: getIsCBE(ownState),
      ...getFlags(ownState),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listPolls()),
    initAssetsHolder: () => dispatch(initAssetsHolder()),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class VotingContent extends Component {
  static propTypes = {
    polls: PropTypes.arrayOf(PTPoll),
    isCBE: PropTypes.bool,
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    initAssetsHolder: PropTypes.func,
    getList: PropTypes.func,
    handleNewPoll: PropTypes.func,
    deposit: PropTypes.instanceOf(Amount),
  }

  constructor () {
    super(...arguments)

    this.state = {
      filter: 'ongoing',
    }
  }

  componentDidMount () {
    this.props.initAssetsHolder()

    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  handleViewOngoing = () => {
    this.setState({
      filter: 'ongoing',
    })
  }

  handleViewEnded = () => {
    this.setState({
      filter: 'ended',
    })
  }

  renderBody (polls) {
    const { filter } = this.state
    const filteredPolls = polls
      .filter((poll) => {
        if (filter === 'ongoing') {
          return poll.active || (poll.status && !poll.active)
        }
        return !poll.status
      })
    return (
      <div styleName='pollsContent'>
        {filteredPolls.map((poll) => (
          <div styleName='pollWrapper' key={poll.id}>
            <Poll
              poll={poll}
              deposit={this.props.deposit}
            />
          </div>
        ))}
      </div>
    )
  }

  render () {
    const polls = this.props.isFetched
      ? this.props.polls.reverse()
      : []

    const { filter } = this.state

    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='tabsFilterWrapper'>
            <button
              styleName={classnames('filterTab', { 'active': filter === 'ongoing' })}
              onClick={this.handleViewOngoing}
            >
              <Translate value={`${prefix}.ongoingPolls`} />
            </button>
            <button
              styleName={classnames('filterTab', { 'active': filter === 'ended' })}
              onClick={this.handleViewEnded}
            >
              <Translate value={`${prefix}.pastPolls`} />
            </button>
          </div>
          {this.props.isFetched && this.props.deposit.isZero() &&
          (
            <div styleName='accessDenied'>
              <i className='material-icons' styleName='accessDeniedIcon'>warning</i>
              <Translate value={`${prefix}.warning1`} />
              <Link to='/wallet'><Translate value={`${prefix}.warning2`} /></Link>
              <Translate value={`${prefix}.warning3`} />
            </div>
          )}
          {this.props.isFetched && this.renderBody(polls)}
        </div>
      </div>
    )
  }
}
