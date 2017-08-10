import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton } from 'material-ui'

import { modalsOpen } from 'redux/modals/actions'
import PollDialog from 'components/dialogs/PollDialog'
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
    handlePollEdit: PropTypes.func,
    handlePollActivate: PropTypes.func
  }

  render () {

    const { model } = this.props

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
                <div styleName='entry-value'>{model.options().count()}</div>
              </div>
              <div styleName='entry entry-documents'>
                <div styleName='entry-label'>Documents:</div>
                <div styleName='entry-value'>{model.files().count()}</div>
              </div>
            </div>
          </div>
        </div>
        <div styleName='body'>
          <h3 styleName='title'>{model.title()}</h3>
          <div styleName='description'>{model.description()}</div>
        </div>
        <div styleName='foot'>
          <div styleName='left'>
            <RaisedButton
              label='Remove'
              styleName='action'
              onTouchTap={() => this.props.handlePollRemove()}
            />
            <RaisedButton
              label='Edit'
              styleName='action'
              onTouchTap={() => this.props.handlePollEdit()}
            />
          </div>
          <div styleName='right'>
            <FlatButton
              label='Details'
              styleName='action'
              onTouchTap={() => this.props.handlePollDetails()}
            />
            <RaisedButton
              label='Activate'
              styleName='action'
              onTouchTap={() => this.props.handlePollActivate()}
            />
            <RaisedButton
              label='Vote'
              styleName='action'
              primary
              onTouchTap={() => this.props.handleVote()}
            />
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
    handlePollEdit: () => dispatch(modalsOpen({
      component: PollDialog,
      props: {
        isModify: true,
        initialValues: op.model
      }
    })),
    handlePollRemove: () => {},
    handlePollActivate: () => {}
  }
}
