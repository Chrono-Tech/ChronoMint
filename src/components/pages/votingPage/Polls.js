import React, {Component} from 'react'
import {connect} from 'react-redux'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import globalStyles from '../../../styles'
import {PollOptions, PollFiles, notActiveStatusBlock, ongoingStatusBlock, closedStatusBlock} from './'
import {showPollModal} from '../../../redux/ui/modal'
import {storePoll} from '../../../redux/polls/poll'
import {activatePoll} from '../../../redux/polls/data'
import {dateFormatOptions} from '../../../config'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  pendings: state.get('pendings'),
  isCBE: state.get('session').isCBE
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
          const activatedByUser = this.props.pendings.toArray().some(item => item.functionName() === 'activatePoll' &&
            parseInt(item.targetObjName(), 10) === key && item.hasConfirmed())
          return (
            <Paper key={key} style={{...globalStyles.item.paper, position: 'relative'}}>
              <div>
                {poll.activated() ? poll.ongoing() ? ongoingStatusBlock : closedStatusBlock : notActiveStatusBlock}
                <div style={globalStyles.item.title}>{poll.pollTitle()}</div>
                <div style={globalStyles.item.greyText}>
                  {poll.pollDescription()}
                </div>
                <PollOptions options={poll.options()} />
                <div style={globalStyles.item.lightGrey}>
                  Exp date: {new Date(poll.deadline()).toLocaleDateString('en-us', dateFormatOptions)}<br />
                  Vote limit: {poll.voteLimit()} votes<br />
                </div>
                <PollFiles files={poll.files()} />
              </div>
              <div>
                {poll.activated()
                  ? poll.ongoing()
                    ? <FlatButton label='Vote' style={{color: 'grey'}}
                        onTouchTap={this.handleShowPollModal.bind(null, key)}
                      />
                    : ''
                  : activatedByUser || !this.props.isCBE
                    ? ''
                    : <FlatButton label='ACTIVATE' style={{color: 'grey'}}
                      onTouchTap={this.handleActivatePoll.bind(null, key)}
                      disabled={poll.isActivating()}
                    />
                }
              </div>
              {
                poll.isActivating() || poll.isFetching()
                  ? <CircularProgress size={24} thickness={1.5} style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
                  : null
              }
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
