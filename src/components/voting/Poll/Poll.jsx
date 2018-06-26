/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import PollDetailsDialog from 'components/dialogs/PollDetailsDialog'
import VoteDialog from 'components/dialogs/VoteDialog'
import Amount from '@chronobank/core/models/Amount'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsOpen } from 'redux/modals/actions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/actions'
import { activatePoll, endPoll, removePoll } from '@chronobank/core/redux/voting/actions'
import { Link } from 'react-router'
import BigNumber from 'bignumber.js'
import { prefix } from './lang'
import './Poll.scss'
import PollActionMenu from './PollActionMenu'

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  return {
    isCBE: state.get(DUCK_SESSION).isCBE,
    timeToken: tokens.item('TIME'),
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    handleVote: () => dispatch(modalsOpen({
      component: VoteDialog,
      props: {
        model: props.model,
      },
    })),
    handlePollDetails: () => dispatch(modalsOpen({
      component: PollDetailsDialog,
      props: {
        model: props.model,
      },
    })),
    handlePollRemove: () => dispatch(removePoll(props.model)),
    handlePollActivate: () => dispatch(activatePoll(props.model)),
    handlePollEnd: () => dispatch(endPoll(props.model)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Poll extends PureComponent {
  static propTypes = {
    // model: PropTypes.instanceOf(PollDetailsModel), // TODO fix this type
    timeToken: PropTypes.instanceOf(TokenModel),
    isCBE: PropTypes.bool,
    deposit: PropTypes.instanceOf(Amount),
    handleVote: PropTypes.func,
    handlePollDetails: PropTypes.func,
    handlePollRemove: PropTypes.func,
    handlePollActivate: PropTypes.func,
    handlePollEnd: PropTypes.func,
  }

  renderStatus () {
    const { model } = this.props
    const details = model.details()

    if (model.isFetching()) {
      return (
        <div styleName='entryStatus'>
          <div styleName='entryBadge badgeOrange'><Translate value={`${prefix}.processing`} /></div>
        </div>
      )
    } else {
      return (
        <div styleName='entryStatus'>
          {details.status && details.active &&
          (<div styleName='entryBadge badgeOrange'><Translate value={`${prefix}.ongoing`} /></div>)}

          {details.status && !details.active &&
          (<div styleName='entryBadge badgeGreen'><Translate value={`${prefix}.new`} /></div>)}

          {!details.status &&
          (<div styleName='entryBadge badgeBlue'><Translate value={`${prefix}.finished`} /></div>)}
        </div>
      )
    }
  }

  render () {
    const { model } = this.props
    const poll = model.poll()

    const details = model.details()

    return (
      <div styleName='root'>
        <PollActionMenu {...this.props} />
        <div styleName='content'>
          <div styleName='layerChart'>
            <div styleName='entry entryTotal'>
              <div styleName='entryTitle'>{details.percents.toString()}%</div>
              <div styleName='entryLabel'><Translate value={`${prefix}.finished`} /></div>
            </div>
            <div styleName='chart'>
              <DoughnutChart
                key={details}
                weight={0.35}
                items={[
                  { value: details.maxOptionTime.toNumber(), fill: '#6ee289' },
                  { value: (details.voteLimitInTIME ? details.voteLimitInTIME.minus(details.maxOptionTime) : new BigNumber(0)).toNumber(), fill: '#6671ae' },
                ]}
              />
            </div>
          </div>
          <div styleName='layerTitle'>
            {/*<Link to='/poll-detail' styleName='title'>{poll.title()}</Link>*/}
            <div onClick={this.props.handlePollDetails} styleName='title'>{poll.title()}</div>

            <div styleName='status'>
              {this.renderStatus()}
            </div>
            <div styleName='days'>
              <Translate
                value={`${prefix}.daysLeft`}
                count={((details.daysLeft % 100 < 20) && (details.daysLeft % 100) > 10) ? 0 : details.daysLeft % 10}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
