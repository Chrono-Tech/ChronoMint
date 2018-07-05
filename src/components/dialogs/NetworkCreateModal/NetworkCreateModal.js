/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from 'redux/modals/actions'
import { ModalDialog } from 'components'
import NetworkCreateModalForm from './NetworkCreateModalForm'
import './NetworkCreateModal.scss'

function mapDispatchToProps (dispatch) {
  return {
    handleCloseModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class DepositTokensModal extends PureComponent {
  static propTypes = {
    handleCloseModal: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.handleCloseModal()
  }

  render () {
    return (
      <ModalDialog>
        <NetworkCreateModalForm
          onSubmit={this.handleSubmit}
          onSubmitSuccess={this.handleSubmitSuccess}
          onCloseModal={this.props.handleCloseModal}
        />
      </ModalDialog>
    )
  }
}
