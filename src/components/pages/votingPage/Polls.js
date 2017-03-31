import React, {Component} from 'react'
import {connect} from 'react-redux'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import globalStyles from '../../../styles'
import {PollOptions, PollFiles, notActiveStatusBlock, ongoingStatusBlock} from './'
import {showPollModal} from '../../../redux/ui/modal'
import {storePoll} from '../../../redux/polls/poll'
import {activatePoll} from '../../../redux/polls/data'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  pendings: state.get('pendings')
})

const mapDispatchToProps = (dispatch) => ({
  storePoll: pollKey => dispatch(storePoll(pollKey)),
  showPollModal: pollKey => dispatch(showPollModal(pollKey)),
  activatePoll: (pollKey, account) => dispatch(activatePoll(pollKey, account))
})

@connect(mapStateToProps, mapDispatchToProps)
class Polls extends Component {
  handleShowPollModal = (pollKey) => {
    this.props.storePoll(pollKey)
    this.props.showPollModal({pollKey})
  };

  handleActivatePoll = (pollKey) => {
    this.props.activatePoll(pollKey, this.props.account)
  };

  render () {
    const {polls} = this.props
    return (
      <div>
        {polls.map(poll => {
          const key = poll.index()
          const activated = this.props.pendings.toArray().some(item => item.functionName() === 'activatePoll' && parseInt(item.targetObjName()) === key)
          return (
            <Paper key={key} style={globalStyles.item.paper}>
              <div>
                {poll.active() ? ongoingStatusBlock : notActiveStatusBlock}
                <div style={globalStyles.item.title}>{poll.pollTitle()}</div>
                <div style={globalStyles.item.greyText}>
                  {poll.pollDescription()}
                </div>
                <PollOptions options={poll.options()} />
                <div style={globalStyles.item.lightGrey}>
                    Published 13 hours ago. {
                    6} days left. {23}% TIME holders already voted.
                </div>
                <PollFiles files={poll.files()} />
              </div>
              <div>
                {poll.active()
                  ? <FlatButton label='Vote' style={{color: 'grey'}}
                    onTouchTap={this.handleShowPollModal.bind(null, key)}
                  />
                  : activated
                    ? ''
                    : <FlatButton label='ACTIVATE' style={{color: 'grey'}}
                      onTouchTap={this.handleActivatePoll.bind(null, key)}
                    />
                }
                <FlatButton label='View' style={{color: 'grey'}}
                  onTouchTap={this.handleShowPollModal.bind(null, key)}
                />
              </div>
            </Paper>
          )
        }
        ).toArray()
        }
      </div>
    )
  }
}

export default Polls
