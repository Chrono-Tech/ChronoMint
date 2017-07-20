// TODO new voting
/* eslint-disable */
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import NewPollForm from '../forms/NewPollForm/NewPollForm'
import { newPoll } from '../../redux/polls/data'
import ModalBase from './ModalBase/ModalBase'
import { Translate } from 'react-redux-i18n'

const mapDispatchToProps = (dispatch) => ({
  newPoll: (params) => dispatch(newPoll(params))
})

@connect(null, mapDispatchToProps)
class NewPollModal extends Component {
  handleSubmit = (values) => {
    const jsValues = values.toJS()
    const deadline = (jsValues.deadline - (jsValues.deadline % 86400000)) + (jsValues.deadlineTime % 86400000)
    return this.props.newPoll({...jsValues, deadline})
  }

  handleSubmitClick = () => {
    this.refs.PollForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open, pristine, submitting} = this.props
    const actions = [
      <FlatButton
        label={<Translate value='terms.cancel' />}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value='poll.create' />}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
        disabled={pristine || submitting}
      />
    ]

    return (
      <ModalBase
        title='poll.new'
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <span /><NewPollForm ref='PollForm' onSubmit={this.handleSubmit} />
      </ModalBase>
    )
  }
}

export default NewPollModal
