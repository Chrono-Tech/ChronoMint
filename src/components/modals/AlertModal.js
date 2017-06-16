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

  getMessage () {
    const {isNotI18n, message} = this.props

    if (!isNotI18n) {
      if (typeof message === 'string') {
        return <Translate value={message} />
      } else {
        return <Translate {...message} />
      }
    } else {
      return message
    }
  }

  render () {
    const {open, title, isNotI18n} = this.props
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
          {this.getMessage()}
        </div>
      </ModalBase>
    )
  }
}

export default AlertModal
