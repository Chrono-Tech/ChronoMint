/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getSelectedPoll, getVotingFlags } from '@chronobank/core/redux/voting/selectors'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { listPolls } from '@chronobank/core/redux/voting/actions'
import moment from 'moment'
import { isCBE } from '@chronobank/core/redux/session/selectors'
import { getDepositAmount } from '@chronobank/core/redux/assetsHolder/selectors'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { push } from 'react-router-redux'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import { Translate } from 'react-redux-i18n'
import PollStatus from 'components/voting/PollStatus/PollStatus'
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import { modalsOpen } from 'redux/modals/actions'
import PollDetailsDialog from 'components/dialogs/PollDetailsDialog'
import { getSelectedPollFromDuck } from '@chronobank/core/redux/voting/selectors/models'
import BigNumber from 'bignumber.js'
import { prefix } from './lang'

import './PollContent.scss'
import DocumentsList from '../../../components/common/DocumentsList/DocumentsList'

function makeMapStateToProps () {
  const getPoll = getSelectedPoll()
  const getIsCBE = isCBE()
  const getFlags = getVotingFlags()
  const getDeposit = getDepositAmount()

  const mapStateToProps = (ownState) => {
    return {
      model: getSelectedPollFromDuck(ownState),
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
    handlePollDetails: (model) => dispatch(modalsOpen({
      component: PollDetailsDialog,
      props: {
        model,
      },
    })),

  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class PollContent extends Component {
  static propTypes = {
    poll: PTPoll,
    palette: PropTypes.arrayOf(PropTypes.string),
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
      push('/voting')
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

              <button onClick={() => this.props.handlePollDetails(this.props.model)}>show detail</button>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <div styleName='description'>{poll.description}</div>
          <div styleName='filesList'>
            <DocumentsList styleName='documents' documents={poll.files} />
          </div>
          <div styleName='cast'>
            <Translate value={`${prefix}.castYourVoteBelow`} />
          </div>
        </div>
      </div>
    )
  }
}
