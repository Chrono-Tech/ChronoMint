import React from 'react'
import PropTypes from 'prop-types'
//import pluralize from 'pluralize'
//import moment from 'moment'

import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { FlatButton, RaisedButton } from 'material-ui'

import { modalsOpen } from 'redux/modals/actions'
import { activatePoll, endPoll, removePoll } from 'redux/voting/actions'

// import PollDialog from 'components/dialogs/PollDialog'
import VoteDialog from 'components/dialogs/VoteDialog'
import PollDetailsDialog from 'components/dialogs/PollDetailsDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'

import './Poll.scss'
import Moment, { SHORT_DATE } from 'components/common/Moment'

function prefix (token) {
  return 'components.dashboard.Poll.' + token
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Poll extends React.Component {

  static propTypes = {
    model: PropTypes.object,
    isCBE: PropTypes.bool,
    handleVote: PropTypes.func,
    handlePollDetails: PropTypes.func,
    handlePollRemove: PropTypes.func,
    // handlePollUpdate: PropTypes.func,
    // handlePollEdit: PropTypes.func,
    handlePollActivate: PropTypes.func,
    handlePollEnd: PropTypes.func
  }

  render () {

    const { model, isCBE } = this.props
    const poll = model.poll()

    const details = model.details()

    return (
      <div styleName='root'>
        <div styleName='head'>
          <div styleName='inner'>
            <div styleName='layer layer-head'>
              <div styleName='entry entry-date'>
                <div styleName='entry-title'>{details.daysLeft}</div>
                {/*<div styleName='entry-label'>{pluralize('day', details.daysLeft, false)} left</div>*/}
                <div styleName='entry-label'><Translate value={prefix('daysLeft')} /></div>
              </div>
              {details.status
                ? (
                  <div styleName='entry entry-status'>
                    {details.active
                      ? (<div styleName='entry-badge badge-orange'><Translate value={prefix('ongoing')} /></div>)
                      : (<div styleName='entry-badge badge-green'><Translate value={prefix('new')} /></div>)
                    }
                  </div>
                )
                : (
                  <div styleName='entry entry-status'>
                    <div styleName='entry-badge badge-blue'><Translate value={prefix('finished')} /></div>
                  </div>
                )
              }
            </div>
            <div styleName='layer layer-chart'>
              <div styleName='entry entry-total'>
                <div styleName='entry-title'>{details.percents.toString()}%</div>
                <div styleName='entry-label'><Translate value={prefix('finished')} /></div>
              </div>
              <div styleName='chart chart-1'>
                <DoughnutChart key={details} weight={0.08} items={[
                  { value: details.daysTotal - details.daysLeft, fillFrom: '#fbda61', fillTo: '#f98019' },
                  { value: details.daysLeft, fill: 'transparent' }
                ]} />
              </div>
              <div styleName='chart chart-2'>
                <DoughnutChart key={details} weight={0.20} items={[
                  { value: details.votedCount.toNumber(), fillFrom: '#311b92', fillTo: '#d500f9' },
                  { value: (details.shareholdersCount.minus(details.votedCount)).toNumber(), fill: 'transparent' }
                ]} />
              </div>
            </div>
            <div styleName='layer layer-entries'>
              <div styleName='entry entry-published'>
                <div styleName='entry-label'>{<Translate value={prefix('published')} />}:</div>
                <div styleName='entry-value'>{details.published && <Moment date={details.published} format={SHORT_DATE}/> || (<i><Translate value={prefix('no')} /></i>)}</div>
                {/*<div styleName='entry-value'>{details.published && moment(details.published).format('MMM Do, YYYY') || (<i><Translate value={prefix('no')} /></i>)}</div>*/}
              </div>
              <div styleName='entry entry-finished'>
                <div styleName='entry-label'>{<Translate value={prefix('endDate')} />}:</div>
                <div styleName='entry-value'>{details.endDate && <Moment date={details.endDate} format={SHORT_DATE}/> || (<i><Translate value={prefix('no')} /></i>)}</div>
                {/*<div styleName='entry-value'>{details.endDate && moment(details.endDate).format('MMM Do, YYYY') || (<i><Translate value={prefix('no')} /></i>)}</div>*/}
              </div>
              <div styleName='entry entry-required'>
                <div styleName='entry-label'><Translate value={prefix('requiredVotes')} />:</div>
                <div styleName='entry-value'>
                  {details.voteLimitInTIME === null
                    ? (<i>Unlimited</i>)
                    : (<span>{details.voteLimitInTIME.round(4).toString()} TIME</span>)
                  }
                </div>
              </div>
              <div styleName='entry entry-received'>
                <div styleName='entry-label'><Translate value={prefix('receivedVotes')} />:</div>
                <div styleName='entry-value'>{details.received.round(4).toString()} TIME</div>
              </div>
              <div styleName='entry entry-variants'>
                <div styleName='entry-label'><Translate value={prefix('variants')} />:</div>
                <div styleName='entry-value'>{details.options.count() || (<i><Translate value={prefix('no')} /></i>)}</div>
              </div>
              <div styleName='entry entry-documents'>
                <div styleName='entry-label'><Translate value={prefix('documents')} />:</div>
                <div styleName='entry-value'>{details.files.count() || (<i><Translate value={prefix('no')} /></i>)}</div>
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
            {/*isCBE && details.status && !details.active && (
              <RaisedButton
                label='Edit'
                styleName='action'
                disabled={model.isFetching()}
                onTouchTap={() => this.props.handlePollEdit()}
              />
            )*/}
          </div>
          <div styleName='right'>
            <FlatButton
              style={{ margin: '16px' }}
              label={<Translate value={prefix('details')} />}
              styleName='action'
              disabled={model.isFetching()}
              onTouchTap={() => this.props.handlePollDetails()}
            />
            {isCBE && details.status && details.active
              ? (
                <RaisedButton
                  label={<Translate value={prefix('endPoll')} />}
                  styleName='action'
                  disabled={model.isFetching()}
                  onTouchTap={() => this.props.handlePollEnd()}
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
                  onTouchTap={() => this.props.handlePollActivate()}
                />
              )
              : null
            }
            {details.status && details.active && !details.memberVote
              ? (
                <RaisedButton
                  label={<Translate value={prefix('vote')} />}
                  styleName='action'
                  primary
                  disabled={model.isFetching()}
                  onTouchTap={() => this.props.handleVote()}
                />
              )
              : null
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const session = state.get('session')
  return {
    isCBE: session.isCBE
  }
}

function mapDispatchToProps (dispatch, op) {
  return {
    handleVote: () => dispatch(modalsOpen({
      component: VoteDialog,
      props: {
        model: op.model
      }
    })),
    handlePollDetails: () => dispatch(modalsOpen({
      component: PollDetailsDialog,
      props: {
        model: op.model
      }
    })),
    // handlePollEdit: () => dispatch(modalsOpen({
    //   component: PollDialog,
    //   props: {
    //     isModify: true,
    //     initialValues: op.model.poll()
    //   }
    // })),
    handlePollRemove: () => dispatch(removePoll(op.model)),
    handlePollActivate: () => dispatch(activatePoll(op.model)),
    // handlePollUpdate: () => dispatch(updatePoll(op.model.poll().id())),
    handlePollEnd: () => dispatch(endPoll(op.model))
  }
}
