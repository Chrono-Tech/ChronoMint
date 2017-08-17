import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import moment from 'moment'

import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'

import { modalsOpen } from 'redux/modals/actions'
import { activatePoll, endPoll, removePoll } from 'redux/voting/actions'

// import PollDialog from 'components/dialogs/PollDialog'
import VoteDialog from 'components/dialogs/VoteDialog'
import PollDetailsDialog from 'components/dialogs/PollDetailsDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'

import './Poll.scss'

@connect(null, mapDispatchToProps)
export default class Poll extends React.Component {

  static propTypes = {
    model: PropTypes.object,
    handleVote: PropTypes.func,
    handlePollDetails: PropTypes.func,
    handlePollRemove: PropTypes.func,
    // handlePollUpdate: PropTypes.func,
    // handlePollEdit: PropTypes.func,
    handlePollActivate: PropTypes.func,
    handlePollEnd: PropTypes.func
  }

  render () {

    const { model } = this.props
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
                <DoughnutChart weight={0.08} items={[
                  { value: details.daysTotal - details.daysLeft, fillFrom: '#fbda61', fillTo: '#f98019' },
                  { value: details.daysLeft, fill: 'transparent' }
                ]} />
              </div>
              <div styleName='chart chart-2'>
                <DoughnutChart weight={0.20} items={[
                  { value: details.votedCount.toNumber(), fillFrom: '#311b92', fillTo: '#d500f9' },
                  { value: (details.shareholdersCount.minus(details.votedCount)).toNumber(), fill: 'transparent' }
                ]} />
              </div>
            </div>
            <div styleName='layer layer-entries'>
              <div styleName='entry entry-published'>
                <div styleName='entry-label'>Published:</div>
                <div styleName='entry-value'>{details.published && moment(details.published).format('MMM Do, YYYY') || (<i>No</i>)}</div>
              </div>
              <div styleName='entry entry-finished'>
                <div styleName='entry-label'>End date:</div>
                <div styleName='entry-value'>{details.endDate && moment(details.endDate).format('MMM Do, YYYY') || (<i>No</i>)}</div>
              </div>
              <div styleName='entry entry-required'>
                <div styleName='entry-label'>Required votes:</div>
                <div styleName='entry-value'>{details.voteLimit || (<i>No</i>)}</div>
              </div>
              <div styleName='entry entry-received'>
                <div styleName='entry-label'>Received votes:</div>
                <div styleName='entry-value'>{details.received.toString()}</div>
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
            {details.status && !details.active && (
              <RaisedButton
                label='Remove'
                styleName='action'
                onTouchTap={() => this.props.handlePollRemove()}
              />
            )}
            {/*details.status && !details.active && (
              <RaisedButton
                label='Edit'
                styleName='action'
                onTouchTap={() => this.props.handlePollEdit()}
              />
            )*/}
          </div>
          <div styleName='right'>
            <FlatButton
              style={{ margin: '16px' }}
              label='Details'
              styleName='action'
              onTouchTap={() => this.props.handlePollDetails()}
            />
            {details.status && details.active && (
              <RaisedButton
                label='End Poll'
                styleName='action'
                onTouchTap={() => this.props.handlePollEnd()}
              />
            )}
            {details.status && !details.active && (
              <RaisedButton
                label='Activate'
                styleName='action'
                onTouchTap={() => this.props.handlePollActivate()}
              />
            )}
            {details.status && details.active && (
              <RaisedButton
                label='Vote'
                styleName='action'
                primary
                onTouchTap={() => this.props.handleVote()}
              />
            )}
          </div>
        </div>
      </div>
    )
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
    handlePollRemove: () => dispatch(removePoll(op.model.poll().id())),
    handlePollActivate: () => dispatch(activatePoll(op.model.poll().id())),
    // handlePollUpdate: () => dispatch(updatePoll(op.model.poll().id())),
    handlePollEnd: () => dispatch(endPoll(op.model.poll().id()))
  }
}
