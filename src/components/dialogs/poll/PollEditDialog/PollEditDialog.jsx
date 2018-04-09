/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import ModalDialog from 'components/dialogs/ModalDialog'
import React, { PureComponent } from 'react'
import './PollEditDialog.scss'
import PollEditForm, { prefix } from './PollEditForm'

export default class PollEditDialog extends PureComponent {
  static propTypes = {
    isModify: PropTypes.bool,
  }

  render () {
    return (
      <ModalDialog title={<Translate value={prefix(this.props.isModify ? 'editPoll' : 'newPoll')} />}>
        <PollEditForm />
      </ModalDialog>
    )
  }
}
