/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

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
