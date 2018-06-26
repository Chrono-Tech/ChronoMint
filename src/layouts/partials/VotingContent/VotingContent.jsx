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
import { DUCK_ASSETS_HOLDER, initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/actions'
import { DUCK_VOTING, listPolls } from '@chronobank/core/redux/voting/actions'
import VotingCollection from '@chronobank/core/models/voting/VotingCollection'
import getStatistics from '@chronobank/core/redux/voting/getters'
import { prefix } from './lang'

import './VotingContent.scss'

function mapStateToProps (state) {
  const voting = state.get(DUCK_VOTING)
  const tokens = state.get(DUCK_TOKENS)

  const timeToken = tokens.item('TIME')

  return {
    list: voting.list(),
    tokens,
    deposit: state.get(DUCK_ASSETS_HOLDER).assets().item(timeToken.address()).deposit(),
    statistics: getStatistics(voting),
    isCBE: state.get(DUCK_SESSION).isCBE,
    isFetched: voting.isFetched(),
    isFetching: voting.isFetching() && !voting.isFetched(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listPolls()),
    initAssetsHolder: () => dispatch(initAssetsHolder()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class VotingContent extends Component {
  static propTypes = {
    isCBE: PropTypes.bool,
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    list: PropTypes.instanceOf(VotingCollection),
    statistics: PropTypes.objectOf(PropTypes.number),
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
      .items()
      .filter((poll) => {
        const details = poll.details()
        if (filter === 'ongoing') {
          return details.active
        }
        return !details.active
      })
    return (
      <div styleName='pollsContent'>
        {filteredPolls.map((poll) => (
          <div styleName='pollWrapper' key={poll.id()}>
            <Poll
              model={poll}
              deposit={this.props.deposit}
            />
          </div>
        ))}
      </div>
    )
  }

  render () {
    const polls = this.props.isFetched
      ? this.props.list.reverse()
      : new VotingCollection()

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
