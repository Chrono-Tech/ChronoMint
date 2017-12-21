import Amount from '@/models/Amount'
import { FlatButton, Paper, RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { activatePoll, endPoll, removePoll } from 'redux/voting/actions'
import { modalsOpen } from 'redux/modals/actions'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import Moment from 'components/common/Moment'
import { SHORT_DATE } from 'models/constants'
import PollDetailsDialog from 'components/dialogs/PollDetailsDialog'
import VoteDialog from 'components/dialogs/VoteDialog'
import { DUCK_SESSION } from 'redux/session/actions'
import TokenModel from 'models/tokens/TokenModel'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import './Poll.scss'

function prefix (token) {
  return `components.dashboard.Poll.${token}`
}

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
    model: PropTypes.object,
    timeToken: PropTypes.instanceOf(TokenModel),
    isCBE: PropTypes.bool,
    deposit: PropTypes.instanceOf(Amount),
    handleVote: PropTypes.func,
    handlePollDetails: PropTypes.func,
    handlePollRemove: PropTypes.func,
    handlePollActivate: PropTypes.func,
    handlePollEnd: PropTypes.func,
  }

  render () {
    const { model, isCBE } = this.props
    const poll = model.poll()

    const details = model.details()

    return (
      <Paper>
        <div styleName='root'>
          <div styleName='head'>
            <div styleName='inner'>
              <div styleName='layer layerHead'>
                <div styleName='entry entryDate'>
                  <div styleName='entryTitle'>{details.daysLeft}</div>
                  <div styleName='entryLabel'>
                    <Translate
                      value={prefix('daysLeft')}
                      count={((details.daysLeft % 100 < 20) && (details.daysLeft % 100) > 10) ? 0 : details.daysLeft % 10}
                    />
                  </div>
                </div>
                {details.status
                  ? (
                    <div styleName='entry entryStatus'>
                      {details.active
                        ? (<div styleName='entryBadge badgeOrange'><Translate value={prefix('ongoing')} /></div>)
                        : (<div styleName='entryBadge badgeGreen'><Translate value={prefix('new')} /></div>)
                      }
                    </div>
                  )
                  : (
                    <div styleName='entry entryStatus'>
                      <div styleName='entryBadge badgeBlue'><Translate value={prefix('finished')} /></div>
                    </div>
                  )
                }
              </div>
              <div styleName='layer layerChart'>
                <div styleName='entry entryTotal'>
                  <div styleName='entryTitle'>{details.percents.toString()}%</div>
                  <div styleName='entryLabel'><Translate value={prefix('finished')} /></div>
                </div>
                <div styleName='chart chart1'>
                  <DoughnutChart
                    key={details}
                    weight={0.08}
                    items={[
                      { value: details.daysTotal - details.daysLeft, fillFrom: '#fbda61', fillTo: '#f98019' },
                      { value: details.daysLeft, fill: 'transparent' },
                    ]}
                  />
                </div>
                <div styleName='chart chart2'>
                  <DoughnutChart
                    key={details}
                    weight={0.20}
                    items={[
                      { value: details.votedCount.toNumber(), fillFrom: '#311b92', fillTo: '#d500f9' },
                      { value: (details.shareholdersCount.minus(details.votedCount)).toNumber(), fill: 'transparent' },
                    ]}
                  />
                </div>
              </div>
              <div styleName='layer layerEntries'>
                <div styleName='entry entryPublished'>
                  <div styleName='entryLabel'>{<Translate value={prefix('published')} />}:</div>
                  <div styleName='entryValue'>
                    {details.published && <Moment date={details.published} format={SHORT_DATE} /> || (
                      <i><Translate value={prefix('no')} /></i>
                    )}
                  </div>
                </div>
                <div styleName='entry entryFinished'>
                  <div styleName='entryLabel'>{<Translate value={prefix('endDate')} />}:</div>
                  <div styleName='entryValue'>
                    {details.endDate && <Moment date={details.endDate} format={SHORT_DATE} /> || (
                      <i><Translate value={prefix('no')} /></i>
                    )}
                  </div>
                </div>
                <div styleName='entry entryRequired'>
                  <div styleName='entryLabel'><Translate value={prefix('requiredVotes')} />:</div>
                  <div styleName='entryValue'>
                    {details.voteLimitInTIME === null
                      ? (<i>Unlimited</i>)
                      : (<span>{this.props.timeToken.removeDecimals(details.voteLimit).toString()} TIME</span>)
                    }
                  </div>
                </div>
                <div styleName='entry entryReceived'>
                  <div styleName='entryLabel'><Translate value={prefix('receivedVotes')} />:</div>
                  <div styleName='entryValue'>{details.received.round(4).toString()} TIME</div>
                </div>
                <div styleName='entry entryVariants'>
                  <div styleName='entryLabel'><Translate value={prefix('variants')} />:</div>
                  <div styleName='entryValue'>{details.options.count() || (
                    <i><Translate value={prefix('no')} /></i>)}</div>
                </div>
                <div styleName='entry entryDocuments'>
                  <div styleName='entryLabel'><Translate value={prefix('documents')} />:</div>
                  <div styleName='entryValue'>{details.files.count() || (
                    <i><Translate value={prefix('no')} /></i>)}</div>
                </div>
              </div>
            </div>
          </div>
          <div styleName='body'>
            <h3 styleName='title'>{poll.title()}</h3>
            <div styleName='description'>{poll.description()}</div>
          </div>
          <div styleName='foot'>
            <div styleName='left'>
              {isCBE && details.status && !details.active
                ? (
                  <RaisedButton
                    label={<Translate value={prefix('remove')} />}
                    styleName='action'
                    disabled={model.isFetching()}
                    onTouchTap={() => this.props.handlePollRemove()}
                  />
                )
                : null
              }
            </div>
            <div styleName='right'>
              <FlatButton
                style={{ margin: '16px' }}
                label={<Translate value={prefix('details')} />}
                styleName='action'
                disabled={model.isFetching()}
                onTouchTap={this.props.handlePollDetails}
              />
              {isCBE && details.status && details.active
                ? (
                  <RaisedButton
                    label={<Translate value={prefix('endPoll')} />}
                    styleName='action'
                    disabled={model.isFetching()}
                    onTouchTap={this.props.handlePollEnd}
                  />
                )
                : null
              }
              {isCBE && details.status && !details.active
                ? (
                  <RaisedButton
                    label={<Translate value={prefix('activate')} />}
                    styleName='action'
                    disabled={model.isFetching()}
                    onTouchTap={this.props.handlePollActivate}
                  />
                )
                : null
              }
              {details.status && details.active && !details.memberVote && details.daysLeft > 0
                ? (
                  <RaisedButton
                    label={<Translate value={prefix('vote')} />}
                    styleName='action'
                    primary
                    disabled={model.isFetching() || this.props.deposit.isZero()}
                    onClick={this.props.handleVote}
                  />
                )
                : null
              }
            </div>
          </div>
        </div>
      </Paper>
    )
  }
}
