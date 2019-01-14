/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import AddTokenForm, { prefix } from './AddTokenForm'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class AddTokenDialog extends PureComponent {
  static propTypes = {
    modalsClose: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.modalsClose()
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  render () {

    return (
      <ModalDialog title={<Translate value={prefix('dialogTitle')} />}>
        <AddTokenForm
          onClose={this.handleClose}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialog>
    )
  }
}
