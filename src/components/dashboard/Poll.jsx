import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'

import { modalsOpen } from 'redux/modals/actions'
import VoteDialog from 'components/dialogs/VoteDialog'
import PollDetailsDialog from 'components/dialogs/PollDetailsDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'

import './Poll.scss'

@connect(null, mapDispatchToProps)
export default class Poll extends React.Component {

  static propTypes = {
    poll: PropTypes.object,
    handleVote: PropTypes.func,
    handlePollDetails: PropTypes.func
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='head'>
          <div styleName='inner'>
            <div styleName='layer layer-head'>
              <div styleName='entry entry-date'>
                <div styleName='entry-title'>31</div>
                <div styleName='entry-label'>days left</div>
              </div>
              <div styleName='entry entry-status'>
                <div styleName='entry-badge'>Ongoing</div>
              </div>
            </div>
            <div styleName='layer layer-chart'>
              <div styleName='entry entry-total'>
                <div styleName='entry-title'>77%</div>
                <div styleName='entry-label'>TIME Holders already voted</div>
              </div>
              <div styleName='chart chart-1'>
                <DoughnutChart weight={0.08} items={[
                  { value: 300, fillFrom: '#fbda61', fillTo: '#f98019' },
                  { value: 60, fill: 'transparent' }
                ]} />
              </div>
              <div styleName='chart chart-2'>
                <DoughnutChart weight={0.20} items={[
                  { value: 250, fillFrom: '#311b92', fillTo: '#d500f9' },
                  { value: 110, fill: 'transparent' }
                ]} />
              </div>
            </div>
            <div styleName='layer layer-entries'>
              <div styleName='entry entry-published'>
                <div styleName='entry-label'>Published:</div>
                <div styleName='entry-value'>May 23, 2017</div>
              </div>
              <div styleName='entry entry-finished'>
                <div styleName='entry-label'>End date:</div>
                <div styleName='entry-value'>Jul 23, 2017</div>
              </div>
              <div styleName='entry entry-required'>
                <div styleName='entry-label'>Required votes:</div>
                <div styleName='entry-value'>120</div>
              </div>
              <div styleName='entry entry-received'>
                <div styleName='entry-label'>Received votes:</div>
                <div styleName='entry-value'>36</div>
              </div>
              <div styleName='entry entry-variants'>
                <div styleName='entry-label'>Variants:</div>
                <div styleName='entry-value'>15</div>
              </div>
              <div styleName='entry entry-documents'>
                <div styleName='entry-label'>Documents:</div>
                <div styleName='entry-value'>4</div>
              </div>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <h3 styleName='title'>Allocate 15% of transaction fees to developers</h3>
          <div styleName='description'>
            With easy access to Broadband and DSL the number of people using
            the Internet has skyrocket in recent years. Email, instant messaging
            and file sharing with other Internet users has also provided a
            platform for faster spreading of viruses, Trojans and Spyware.
          </div>
        </div>
        <div styleName='foot'>
          <FlatButton
            label='Details'
            styleName='action'
            onTouchTap={() => this.props.handlePollDetails()}
          />
          <RaisedButton
            label='Vote'
            styleName='action'
            primary
            onTouchTap={() => this.props.handleVote()}
          />
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleVote: (data) => dispatch(modalsOpen({
      component: VoteDialog,
      data
    })),
    handlePollDetails: (data) => dispatch(modalsOpen({
      component: PollDetailsDialog,
      data
    }))
  }
}
