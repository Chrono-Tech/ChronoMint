import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import NewPollForm from '../forms/NewPollForm/NewPollForm'
import { newPoll } from '../../redux/polls/data'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

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
        label='Cancel'
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label='Create Poll'
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
        disabled={pristine || submitting}
      />
    ]

    return (
      <Dialog
        title={<div>
          New Poll
          <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={{padding: 26}}
        titleStyle={{paddingBottom: 10}}
        modal
        autoScrollBodyContent
        open={open}>
        <span /><NewPollForm ref='PollForm' onSubmit={this.handleSubmit} />
      </Dialog>
    )
  }
}

export default NewPollModal
