import {connect} from 'react-redux'
import React, {Component} from 'react'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import {Dialog, FlatButton, CircularProgress} from 'material-ui'
import globalStyles from '../../../styles'
import Options from './Options'
import {votePoll} from '../../../redux/polls/data'

const mapDispatchToProps = (dispatch) => ({
  votePoll: (params) => dispatch(votePoll(params))
})

const mapStateToProps = state => {
  const poll = state.get('poll')
  return ({
    account: state.get('session').account,
    isTransaction: state.getIn(['polls', poll.index()]).isTransaction(),
    index: poll.index(),
    options: poll.options(),
    pollTitle: poll.pollTitle(),
    pollDescription: poll.pollDescription()
  })
}

@connect(mapStateToProps, mapDispatchToProps)
class PollModal extends Component {
  handleClose = () => {
    this.props.hideModal()
  };

  handleVote = (pollKey, optionIndex) => {
    this.props.votePoll({pollKey, optionIndex, account: this.props.account})
  };

  render () {
    const {open, index, pollTitle, pollDescription, options} = this.props
    const actions = [
      <FlatButton
        label='Close'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.handleClose}
      />
    ]

    return (
      <Dialog
        title={<div>
          {pollTitle}
          <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={{padding: 26}}
        titleStyle={{paddingBottom: 10}}
        open={open}
        contentStyle={{position: 'relative'}}
      >
        <div style={globalStyles.modalGreyText}>
          {pollDescription}
        </div>
        {
          this.props.isTransaction
            ? <CircularProgress size={24} thickness={1.5} style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
            : null
        }
        <Options options={options} pollKey={index} disabled={this.props.isTransaction} onVote={this.handleVote} />
      </Dialog>
    )
  }
}

export default PollModal
