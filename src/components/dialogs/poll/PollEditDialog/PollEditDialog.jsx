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
