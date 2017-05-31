import React, { Component } from 'react'
import { FlatButton } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import globalStyles from '../../styles'
import ModalBase from './ModalBase/ModalBase'

class AlertModal extends Component {
  handleClose = () => {
    this.props.hideModal()
    this.props.then && this.props.then()
  }

  render () {
    const {open, title, message, isNotI18n} = this.props
    const actions = [
      <FlatButton
        label={<Translate value='terms.close' />}
        primary
        onTouchTap={this.handleClose}
      />
    ]

    return (
      <ModalBase
        title={title}
        isNotI18n={isNotI18n}
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <div style={globalStyles.greyText}>
          {isNotI18n ? message : <Translate value={message} />}
        </div>
      </ModalBase>
    )
  }
}

export default AlertModal
