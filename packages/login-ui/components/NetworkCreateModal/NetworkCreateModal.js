/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from 'redux/modals/actions'
import { handleSubmitCreateNetwork } from '@chronobank/login/redux/network/actions'
import { ModalDialog } from 'components'
import NetworkCreateModalForm from './NetworkCreateModalForm'
import './NetworkCreateModal.scss'
import { prefix } from "../../../../src/components/wallet/TwoFaConfirmModal/lang";

function mapDispatchToProps (dispatch) {
  return {
    handleCloseModal: () => dispatch(modalsClose()),
    handleSubmitCreateNetwork: (url, alias) => dispatch(handleSubmitCreateNetwork(url, alias)),
  }
}

@connect(null, mapDispatchToProps)
export default class NetworkCreateModal extends PureComponent {
  static propTypes = {
    handleCloseModal: PropTypes.func,
    handleSubmitCreateNetwork: PropTypes.func,
  }

  handleSubmitSuccess = () => {
    this.props.handleCloseModal()
  }

  handleSubmit({ url, alias }){
    this.props.handleSubmitCreateNetwork(url, alias)
  }

  render () {
    console.log('createmodal')
    return (
      <ModalDialog title='Add a Network'>
        <NetworkCreateModalForm
          onSubmit={this.handleSubmit}
          onSubmitSuccess={this.handleSubmitSuccess}
          onCloseModal={this.props.handleCloseModal}
        />
      </ModalDialog>
    )
  }
}
