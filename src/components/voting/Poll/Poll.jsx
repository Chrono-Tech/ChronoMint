/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import { push } from 'react-router-redux'
import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { activatePoll, endPoll, removePoll } from '@chronobank/core/redux/voting/actions'
import { POLLS_SELECTED } from '@chronobank/core/redux/voting/constants'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import BigNumber from 'bignumber.js'
import { prefix } from './lang'
import './Poll.scss'
import PollActionMenu from './PollActionMenu'
import PollStatus from '../PollStatus/PollStatus'

function mapDispatchToProps (dispatch, props) {
  return {
    handlePollDetails: async () => {
      await dispatch({ type: POLLS_SELECTED, id: props.poll.id })
      dispatch(push('/poll'))
    },
    handlePollRemove: () => dispatch(removePoll(props.poll)),
    handlePollActivate: () => dispatch(activatePoll(props.poll)),
    handlePollEnd: () => dispatch(endPoll(props.poll)),
  }
}

@connect(null, mapDispatchToProps)
export default class Poll extends PureComponent {
  static propTypes = {
    isCBE: PropTypes.bool,
    poll: PTPoll,
    userAccount: PropTypes.string,
    deposit: PropTypes.instanceOf(Amount),
    handlePollDetails: PropTypes.func,
    handlePollRemove: PropTypes.func,
    handlePollActivate: PropTypes.func,
    handlePollEnd: PropTypes.func,
  }

  render () {
    const { poll, userAccount, isCBE } = this.props

    if (!isCBE  && !poll.active && poll.owner !== userAccount) {
      return null
    }
    return (
      <div styleName='root'>
        <PollActionMenu {...this.props} />
        <div styleName='content'>
          <div styleName='layerChart'>
            <div styleName='entry entryTotal'>
              <div styleName='entryTitle'>{poll.percents.toString()}%</div>
              <div styleName='entryLabel'><Translate value={`${prefix}.finished`} /></div>
            </div>
            <div styleName='chart'>
              <DoughnutChart
                key={poll}
                rounded={false}
                weight={0.35}
                items={[
                  { value: poll.maxOptionTime.toNumber(), fill: '#6ee289' },
                  { value: (poll.voteLimitInTIME ? poll.voteLimitInTIME.minus(poll.maxOptionTime) : new BigNumber(0)).toNumber(), fill: '#6671ae' },
                ]}
              />
            </div>
          </div>
          <div styleName='layerTitle'>
            <button onClick={this.props.handlePollDetails} styleName='title'>{poll.title}</button>

            <div styleName='status'>
              <PollStatus poll={poll} />
            </div>
            <div styleName='days'>
              <Translate
                value={`${prefix}.daysLeft`}
                count={((poll.daysLeft % 100 < 20) && (poll.daysLeft % 100) > 10) ? 0 : poll.daysLeft % 10}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
