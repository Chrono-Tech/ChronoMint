/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsClose, modalsOpen } from '@chronobank/core/redux/modals/actions'
import {
  customNetworkEdit,
  customNetworksDelete,
  customNetworkCreate,
} from '@chronobank/core/redux/persistAccount/actions'
import {
  AccountCustomNetwork,
} from '@chronobank/core/models/wallet/persistAccount'
import ModalDialog from 'components/dialogs/ModalDialog'
import NetworkCreateModalForm from './NetworkCreateModalForm/NetworkCreateModalForm'

function mapDispatchToProps (dispatch) {
  return {
    handleCloseModal: () => dispatch(modalsClose()),
    handleSubmitCreateNetwork: (url, ws, alias) => dispatch(customNetworkCreate(url, ws, alias)),
    handleSubmitEditNetwork: (network) => dispatch(customNetworkEdit(network)),
    handleDeleteNetwork: (network) => dispatch(customNetworksDelete(network)),
    openConfirmDeleteModal: (network = null) => dispatch(modalsOpen({
      componentName: 'NetworkDeleteModal',
      props: { network },
    })),
  }
}

@connect(null, mapDispatchToProps)
export default class NetworkCreateModal extends PureComponent {
  static propTypes = {
    handleCloseModal: PropTypes.func,
    handleSubmitCreateNetwork: PropTypes.func,
    handleSubmitEditNetwork: PropTypes.func,
    handleDeleteNetwork: PropTypes.func,
    openConfirmDeleteModal: PropTypes.func,
    network: PropTypes.instanceOf(AccountCustomNetwork),
  }

  static defaultProps = {
    network: null,
  }

  handleSubmitSuccess = () => {
    this.props.handleCloseModal()
  }

  handleSubmit = (values) => {
    const { handleSubmitCreateNetwork, handleSubmitEditNetwork, network } = this.props

    const url = values.get('url')
    const ws = values.get('ws')
    const alias = values.get('alias')

    if (network){

      const networkModel = new AccountCustomNetwork({
        ...network,
        url,
        ws,
        name: alias,
      })

      handleSubmitEditNetwork(networkModel)
    } else {
      handleSubmitCreateNetwork(url, ws, alias)
    }
  }

  handleDeleteNetwork = () => {
    const { network, openConfirmDeleteModal, handleCloseModal } = this.props

    if (network){
      handleCloseModal()
      openConfirmDeleteModal(network)
    }

    // this.props.handleCloseModal()
  }

  render () {
    const { network } = this.props

    return (
      <ModalDialog
        title={
          network
            ? <Translate value='NetworkCreateModal.titleEditMode' />
            : <Translate value='NetworkCreateModal.titleAddMode' />
        }
      >
        <NetworkCreateModalForm
          onSubmit={this.handleSubmit}
          onSubmitSuccess={this.handleSubmitSuccess}
          onCloseModal={this.props.handleCloseModal}
          network={network}
          initialValues={{
            url: network && network.url,
            ws: network && network.ws,
            alias: network && network.name,
          }}
          handleDeleteNetwork={this.handleDeleteNetwork}
        />
      </ModalDialog>
    )
  }
}
