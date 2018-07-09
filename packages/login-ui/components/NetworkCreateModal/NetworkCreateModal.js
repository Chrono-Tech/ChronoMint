/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from 'redux/modals/actions'
import {
  handleSubmitCreateNetwork,
  handleSubmitEditNetwork,
} from '@chronobank/login/redux/network/actions'
import {
  AccountCustomNetwork,
} from '@chronobank/core/models/wallet/persistAccount'
import { ModalDialog } from 'components'
import NetworkCreateModalForm from './NetworkCreateModalForm'

import './NetworkCreateModal.scss'

function mapDispatchToProps (dispatch) {
  return {
    handleCloseModal: () => dispatch(modalsClose()),
    handleSubmitCreateNetwork: (url, alias) => dispatch(handleSubmitCreateNetwork(url, alias)),
    handleSubmitEditNetwork: (url, alias) => dispatch(handleSubmitEditNetwork(url, alias)),
  }
}

@connect(null, mapDispatchToProps)
export default class NetworkCreateModal extends PureComponent {
  static propTypes = {
    handleCloseModal: PropTypes.func,
    handleSubmitCreateNetwork: PropTypes.func,
    network: PropTypes.instanceOf(AccountCustomNetwork),
  }

  static defaultProps = {
    network: null,
  }

  handleSubmitSuccess = () => {
    this.props.handleCloseModal()
  }

  handleSubmit(values){
    const { handleSubmitCreateNetwork, network } = this.props

    const url = values.get('url')
    const alias = values.get('alias')

    if (network){

    }
    else {
      handleSubmitCreateNetwork (url, alias)
    }
  }

  render () {
    return (
      <ModalDialog title='Add a Network'>
        <NetworkCreateModalForm
          onSubmit={this.handleSubmit.bind(this)}
          onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
          onCloseModal={this.props.handleCloseModal}
          network={this.props.network}
        />
      </ModalDialog>
    )
  }
}
