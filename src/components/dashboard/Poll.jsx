import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'

import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'

import { modalsOpen } from 'redux/modals/actions'
import { activatePoll, endPoll, removePoll } from 'redux/voting/actions'

// import PollDialog from 'components/dialogs/PollDialog'
import VoteDialog from 'components/dialogs/VoteDialog'
import PollDetailsDialog from 'components/dialogs/PollDetailsDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'

import './Poll.scss'
import Moment, { SHORT_DATE } from 'components/common/Moment'

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
                <div styleName='entry-label'>{pluralize('day', details.daysLeft, false)} left</div>
              </div>
              {details.status
                ? (
                  <div styleName='entry entry-status'>
                    {details.active
                      ? (<div styleName='entry-badge badge-orange'>Ongoing</div>)
                      : (<div styleName='entry-badge badge-green'>New</div>)
                    }
                  </div>
                )
                : (
                  <div styleName='entry entry-status'>
                    <div styleName='entry-badge badge-blue'>Finished</div>
                  </div>
                )
              }
            </div>
            <div styleName='layer layer-chart'>
              <div styleName='entry entry-total'>
                <div styleName='entry-title'>{details.percents.toString()}%</div>
                <div styleName='entry-label'>TIME Holders already voted</div>
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
                <div styleName='entry-label'>Published:</div>
                <div styleName='entry-value'>{details.published && <Moment date={details.published} format={SHORT_DATE}/> || (<i>No</i>)}</div>
              </div>
              <div styleName='entry entry-finished'>
                <div styleName='entry-label'>End date:</div>
                <div styleName='entry-value'>{details.endDate && <Moment date={details.endDate} format={SHORT_DATE}/> || (<i>No</i>)}</div>
              </div>
              <div styleName='entry entry-required'>
                <div styleName='entry-label'>Required votes:</div>
                <div styleName='entry-value'>
                  {details.voteLimit === null
                    ? (<i>No</i>)
                    : (<span>{details.voteLimit.toString()} TIME</span>)
                  }
                </div>
              </div>
              <div styleName='entry entry-received'>
                <div styleName='entry-label'>Received votes:</div>
                <div styleName='entry-value'>{details.received.toString()} TIME</div>
              </div>
              <div styleName='entry entry-variants'>
                <div styleName='entry-label'>Variants:</div>
                <div styleName='entry-value'>{details.options.count() || (<i>No</i>)}</div>
              </div>
              <div styleName='entry entry-documents'>
                <div styleName='entry-label'>Documents:</div>
                <div styleName='entry-value'>{details.files.count() || (<i>No</i>)}</div>
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
                  label='Remove'
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
              label='Details'
              styleName='action'
              disabled={model.isFetching()}
              onTouchTap={() => this.props.handlePollDetails()}
            />
            {isCBE && details.status && details.active
              ? (
                <RaisedButton
                  label='End Poll'
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
                  label='Activate'
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
                  label='Vote'
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
