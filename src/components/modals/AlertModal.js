import React, { Component } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

class AlertModal extends Component {
  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open, title, message} = this.props
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
          {title}
          <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
            <NavigationClose />
          </IconButton>
        </div>}
        actions={actions}
        actionsContainerStyle={{padding: 26}}
        titleStyle={{paddingBottom: 10}}
        modal
        open={open}>
        <div style={globalStyles.modalGreyText}>
          {message}
        </div>
      </Dialog>
    )
  }
}

export default AlertModal
