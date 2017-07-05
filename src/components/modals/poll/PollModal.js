// TODO new voting
/* eslint-disable */
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { FlatButton, CircularProgress } from 'material-ui'
import globalStyles from '../../../styles'
import Options from './Options'
import { votePoll } from '../../../redux/polls/data'
import ModalBase from '../ModalBase/ModalBase'
import { Translate } from 'react-redux-i18n'

const mapDispatchToProps = (dispatch) => ({
  votePoll: (params) => dispatch(votePoll(params))
})

const mapStateToProps = state => {
  const poll = state.get('poll')
  return ({
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
  }

  handleVote = (pollKey, optionIndex) => {
    this.props.votePoll({pollKey, optionIndex})
  }

  render () {
    const {open, index, pollTitle, pollDescription, options} = this.props
    const actions = [
      <FlatButton
        label={<Translate value='terms.close' />}
        primary
        onTouchTap={this.handleClose}
      />
    ]

    return (
      <ModalBase
        title={pollTitle}
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <div style={globalStyles.greyText}>
          {pollDescription}
        </div>
        {
          this.props.isTransaction
            ? <CircularProgress size={24} thickness={1.5} style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translateX(-50%) translateY(-50%)'
            }} />
            : null
        }
        <Options options={options} pollKey={index} disabled={this.props.isTransaction} onVote={this.handleVote} />
      </ModalBase>
    )
  }
}

export default PollModal
