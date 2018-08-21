/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Poll from 'components/voting/Poll/Poll'
import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { getPollsDetailsList, getVotingFlags } from '@chronobank/core/redux/voting/selectors'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { listPolls } from '@chronobank/core/redux/voting/thunks'
import { getAccount, isCBE } from '@chronobank/core/redux/session/selectors'
import { getDepositAmount } from '@chronobank/core/redux/assetsHolder/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import PollDepositWarningWidget from 'components/voting/VotingWarningWidgets/PollDepositWarningWidget'
import EmptyWarningWidget from 'components/voting/VotingWarningWidgets/EmptyWarningWidget'
import Preloader from 'components/common/Preloader/Preloader'
import { prefix } from './lang'

import './VotingContent.scss'

function makeMapStateToProps (state) {
  const getPolls = getPollsDetailsList()
  const getIsCBE = isCBE()
  const getFlags = getVotingFlags()
  const getDeposit = getDepositAmount()
  const userAccount = getAccount(state)

  const mapStateToProps = (ownState) => {
    return {
      polls: getPolls(ownState),
      deposit: getDeposit(ownState),
      isCBE: getIsCBE(ownState),
      userAccount: userAccount,
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
    userAccount: PropTypes.string,
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
    const { userAccount, isCBE } = this.props
    const filteredPolls = polls
      .filter((poll) => {
        if (filter === 'ongoing') {
          return poll.active || (poll.status && !poll.active) || poll.id.includes('stub')
        }
        return !poll.status && !poll.active && !poll.id.includes('stub')
      })
      .sort((a: PTPoll, b: PTPoll) => {
        return a.published > b.published ? -1 : a.published < b.published
      })

    return (
      <div>
        {polls.length > 0 && (
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
        )}

        <div styleName='pollsContent'>
          {filteredPolls.map((poll) => (
            <Poll
              key={poll.id}
              isCBE={isCBE}
              userAccount={userAccount}
              poll={poll}
              deposit={this.props.deposit}
            />
          ))}
        </div>
      </div>
    )
  }

  render () {
    const polls = this.props.isFetched
      ? this.props.polls.reverse()
      : []

    return (
      <div styleName='root'>
        <div styleName='content'>
          {this.props.isFetched && this.props.deposit.isZero() && (<PollDepositWarningWidget />)}

          {this.props.isFetched ? this.renderBody(polls) : <Preloader />}

          {this.props.isFetched && polls.length <= 0 && (<EmptyWarningWidget />)}
        </div>
      </div>
    )
  }
}
