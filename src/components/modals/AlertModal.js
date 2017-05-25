import React, { Component } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import globalStyles from '../../styles'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

class AlertModal extends Component {
  handleClose = () => {
    this.props.hideModal()
    this.props.then && this.props.then()
  }

  render () {
    const {open, title, message, isNotI18n} = this.props
    const actions = [
      <FlatButton
        label='Close'
        primary
        onTouchTap={this.handleClose}
      />
    ]

    return (
      <Dialog
        title={<div>
          {isNotI18n ? title : <Translate value={title} />}
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
          {isNotI18n ? message : <Translate value={message} />}
        </div>
      </Dialog>
    )
  }
}

export default AlertModal
