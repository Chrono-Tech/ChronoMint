import ModalDialog from 'components/dialogs/ModalDialog'
import TwoFAForm from 'components/dialogs/TwoFA/TwoFAForm'
import React, { Component } from 'react'

export default class TwoFADialog extends Component {
  render () {
    return (
      <ModalDialog>
        <TwoFAForm />
      </ModalDialog>
    )
  }
}
