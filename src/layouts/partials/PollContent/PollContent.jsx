/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getSelectedPoll, getVotingFlags } from '@chronobank/core/redux/voting/selectors'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { listPolls, vote } from '@chronobank/core/redux/voting/thunks'
import { navigateToVoting } from 'redux/ui/navigation'
import moment from 'moment'
import { isCBE } from '@chronobank/core/redux/session/selectors'
import { getDepositAmount } from '@chronobank/core/redux/assetsHolder/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import { Translate } from 'react-redux-i18n'
import PollStatus from 'components/voting/PollStatus/PollStatus'
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import DocumentsList from 'components/common/DocumentsList/DocumentsList'
import Amount from '@chronobank/core/models/Amount'
import BigNumber from 'bignumber.js'
import { prefix } from './lang'

import './PollContent.scss'

function makeMapStateToProps () {
  const getPoll = getSelectedPoll()
  const getIsCBE = isCBE()
  const getFlags = getVotingFlags()
  const getDeposit = getDepositAmount()

  const mapStateToProps = (ownState) => {
    return {
      poll: getPoll(ownState),
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
    handleVote: (choice) => () => {
      dispatch(vote(choice))
    },
    handleGoVotingPage: () => dispatch(navigateToVoting()),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class PollContent extends Component {
  static propTypes = {
    poll: PTPoll,
    isCBE: PropTypes.bool,
    deposit: PropTypes.instanceOf(Amount),
    palette: PropTypes.arrayOf(PropTypes.string),
    handleVote: PropTypes.func,
    handleGoVotingPage: PropTypes.func,
  }

  static defaultProps = {
    palette: [
      '#00e5ff',
      '#f98019',
      '#fbda61',
      '#fb61da',
      '#8061fb',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FF00FF',
      '#FFFF00',
      '#FF5500',
    ],
  }

  componentDidMount () {
    if (!this.props.poll) {
      this.props.handleGoVotingPage()
    }
  }

  renderDuration () {
    const { poll } = this.props
    const momentPublished = moment(poll.published)
    const momentEndDate = moment(poll.endDate)
    let isShowMonth = poll.published.getMonth() !== poll.endDate.getMonth()

    return (
      <span>{momentPublished.format(isShowMonth ? 'DD MMM' : 'DD')} - {momentEndDate.format('DD MMM, YYYY')}</span>
    )
  }

  renderMostPopularOption () {
    const { poll } = this.props

    return (
      <span>TIME&nbsp;
        <TokenValueSimple value={poll.maxOptionTime} />&nbsp;
        <Translate value={`${prefix}.of`} />&nbsp;
        <TokenValueSimple value={poll.voteLimitInTIME} />&nbsp;
        <Translate value={`${prefix}.percent`} num={poll.maxOptionTime.mul(100).div(poll.voteLimitInTIME).toFixed(2)} />
      </span>
    )
  }

  renderEntry (entry, i) {
    const { palette, poll, deposit } = this.props
    const { count } = entry
    const progress = count.mul(100).div(poll.voteLimitInTIME).toFixed(2)
    const background = palette[i % palette.length]
    return (
      <div styleName='entry' key={i}>
        <div styleName='title'><b>{i + 1}.</b>&nbsp;{entry.option}</div>
        {!poll.hasMember || poll.memberOption === (i + 1) ? (
          <div styleName='action'>
            <button
              disabled={poll.isFetching || deposit.isZero() || poll.hasMember || poll.daysLeft <= 0 || !(poll.status && poll.active)}
              onClick={this.props.handleVote(i)}
              style={{ background }}
            >
              <i className='chronobank-icon'>check</i>
            </button>
          </div>
        ) : null}
        <div styleName='progress' style={{ width: `${progress}%`, background }} />
      </div>
    )
  }

  render () {
    const { poll, palette } = this.props
    if (!poll) {
      return null
    }

    return (
      <div styleName='root'>
        <div styleName='head'>
          <div styleName='mainTitle'>{poll.title}</div>
          <div styleName='content'>
            <div styleName='layerChart'>
              <div styleName='entry entryTotal'>
                <div styleName='entryTitle'>{poll.percents.toString()}%</div>
                <div styleName='entryLabel'><Translate value={`${prefix}.finished`} /></div>
              </div>
              <div styleName='chart'>
                <DoughnutChart
                  weight={0.35}
                  rounded={false}
                  items={[
                    ...poll.voteEntries.map((item, index) => {
                      return {
                        value: item.count.toNumber(),
                        fill: palette[index % palette.length],
                      }
                    }),
                    { value: (poll.voteLimitInTIME ? poll.voteLimitInTIME.minus(poll.received) : new BigNumber(0)).toNumber(), fill: '#6671ae' },
                  ]}
                />
              </div>
            </div>
            <div styleName='layerInfo'>
              <div styleName='status'>
                <PollStatus poll={poll} />
              </div>
              <div styleName='days'>
                <Translate
                  value={`${prefix}.daysLeft`}
                  count={((poll.daysLeft % 100 < 20) && (poll.daysLeft % 100) > 10) ? 0 : poll.daysLeft % 10}
                />
              </div>

              <div styleName='infoBlock'>
                <div styleName='title'><Translate value={`${prefix}.duration`} /></div>
                <div styleName='value'>{this.renderDuration()}</div>
              </div>

              <div styleName='infoBlock'>
                <div styleName='title'><Translate value={`${prefix}.mostPopularOptionReceived`} /></div>
                <div styleName='value'>{this.renderMostPopularOption()}</div>
              </div>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <div styleName='description'>{poll.description}</div>
          <div styleName='wrapper'>
            <div styleName='filesList'>
              <DocumentsList documents={poll.files} />
            </div>
            <div styleName='historyLinkWrapper'>
              <Link to='/vote-history'>
                <Translate value={`${prefix}.descriptionHistory`} />
              </Link>
            </div>
          </div>
          <div styleName='cast'>
            <Translate value={`${prefix}.castYourVoteBelow`} />
          </div>
          <div styleName='entriesWrapper'>
            {poll.voteEntries.map((entry, i) => this.renderEntry(entry, i))}
          </div>
        </div>
      </div>
    )
  }
}
