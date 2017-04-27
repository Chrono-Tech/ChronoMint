import React, { Component } from 'react'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import { showPollModal, showAlertModal } from '../../../redux/ui/modal'
import { storePoll } from '../../../redux/polls/poll'
import { activatePoll, closePoll } from '../../../redux/polls/data'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  isCBE: state.get('session').isCBE,
  deposit: state.get('wallet').time.deposit
})

const mapDispatchToProps = (dispatch) => ({
  storePoll: pollKey => dispatch(storePoll(pollKey)),
  showPollModal: pollKey => dispatch(showPollModal(pollKey)),
  activatePoll: (pollKey, account) => dispatch(activatePoll(pollKey, account)),
  closePoll: (pollKey, account) => dispatch(closePoll(pollKey, account)),
  showAlertModal: (message) => dispatch(showAlertModal(message))
})

@connect(mapStateToProps, mapDispatchToProps)
class Buttons extends Component {
  handleShowPollModal = (pollKey, deposit) => {
    if (deposit > 0) {
      this.props.storePoll(pollKey)
      this.props.showPollModal({pollKey})
    } else {
      this.props.showAlertModal({title: 'Error', message: 'Deposit TIME if you want get access to Voting'})
    }
  }

  handleActivatePoll = (pollKey) => {
    this.props.activatePoll(pollKey, this.props.account)
  }

  handleClosePoll = (pollKey) => {
    this.props.closePoll(pollKey, this.props.account)
  }

  render () {
    const {poll} = this.props
    const activatedByUser = true // TODO MINT-92 Deal with this strange check
    // const activatedByUser = this.props.pendings.toArray().some(item => item.functionName() === 'activatePoll' &&
    // parseInt(item.targetObjName(), 10) === poll.index() && item.hasConfirmed())

    const buttonVote = <FlatButton label='VOTE' style={{color: 'grey'}}
      onTouchTap={this.handleShowPollModal.bind(null, this.props.poll.index(), this.props.deposit)}
      disabled={this.props.poll.isTransaction() || this.props.poll.isFetching()} />

    const buttonActivate = <FlatButton label='ACTIVATE' style={{color: 'grey'}}
      onTouchTap={this.handleActivatePoll.bind(null, this.props.poll.index())}
      disabled={this.props.poll.isTransaction() || this.props.poll.isFetching()} />

    const buttonClose = <FlatButton label='CLOSE' style={{color: 'grey'}}
      onTouchTap={this.handleClosePoll.bind(null, this.props.poll.index())}
      disabled={this.props.poll.isTransaction() || this.props.poll.isFetching()} />

    return (
      <div>
        {poll.activated()
          ? poll.ongoing()
            ? poll.deadline() > new Date().getTime()
              ? buttonVote
              : this.props.isCBE
                ? buttonClose
                : ''
            : ''
          : activatedByUser || !this.props.isCBE
            ? ''
            : buttonActivate
        }
      </div>
    )
  }
}

export default Buttons
