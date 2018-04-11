/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ModalDialog from 'components/dialogs/ModalDialog'
import React, { PureComponent } from 'react'
import './PollEditDialog.scss'
import PollEditForm from './PollEditForm'

export default class PollEditDialog extends PureComponent {
  render () {
    return (
      <ModalDialog>
        <PollEditForm />
      </ModalDialog>
    )
  }
}
