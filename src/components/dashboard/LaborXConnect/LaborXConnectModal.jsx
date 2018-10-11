/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'
import LaborXConnect from './LaborXConnect'
import './LaborXConnect.scss'

function mapDispatchToProps (dispatch) {
  return {
    handleCloseModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class LaborXConnectModal extends PureComponent {
  static propTypes = {
    handleCloseModal: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.handleCloseModal()
  }

  render () {
    return (
      <ModalDialog>
        <LaborXConnect
          onSubmitSuccess={this.handleSubmitSuccess}
          onCloseModal={this.props.handleCloseModal}
        />
      </ModalDialog>
    )
  }
}
