import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Dialog, FlatButton, RaisedButton} from 'material-ui'
import NewPollForm from '../forms/NewPollForm/NewPollForm'
import {newPoll} from '../../redux/polls/data'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

const mapDispatchToProps = (dispatch) => ({
  newPoll: (params) => dispatch(newPoll(params))
})

@connect(null, mapDispatchToProps)
class NewPollModal extends Component {
  handleSubmit = (values) => {
    const account = window.localStorage.getItem('chronoBankAccount')
    const jsValues = values.toJS()
    return this.props.newPoll({...jsValues, account})
  };

  handleSubmitClick = () => {
    this.refs.PollForm.getWrappedInstance().submit()
  };

  handleClose = () => {
    this.props.hideModal()
  };

  render () {
    const {open, pristine, submitting} = this.props
    const actions = [
      <RaisedButton
        label='Create Poll'
        buttonStyle={globalStyles.raisedButton}
        labelStyle={globalStyles.raisedButtonLabel}
        primary
        onTouchTap={this.handleSubmitClick.bind(this)}
        disabled={pristine || submitting}
      />,
      <FlatButton
        label='Cancel'
        style={globalStyles.flatButton}
        labelStyle={globalStyles.flatButtonLabel}
        primary
        onTouchTap={this.handleClose}
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
