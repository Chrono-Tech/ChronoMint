import React, {Component} from 'react'
import {Dialog, TextField, FlatButton} from 'material-ui'

class PromptPassword extends Component {
  constructor () {
    super()
    this.state = {
      value: null
    }
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })
  };

  handleSubmit = () => {
    this.props.callback(null, this.state.value)
    this.props.hideModal()
  };

  handleClose = () => {
    this.props.hideModal()
  };

  render () {
    const {title, open} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label='Submit'
        primary
        onTouchTap={this.handleSubmit}
      />
    ]

    const customContentStyle = {
      width: '300px',
      maxWidth: '300px'
    }
    return (
      <Dialog
        title={title || 'Confirm action'}
        actions={actions}
        modal
        contentStyle={customContentStyle}
        open={open}>
        <TextField type='password'
          name='password'
          floatingLabelText='Enter password'
          onChange={this.handleChange} />
      </Dialog>
    )
  }
}

export default PromptPassword
