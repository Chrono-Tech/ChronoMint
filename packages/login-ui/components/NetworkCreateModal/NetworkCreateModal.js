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
  handleDeleteNetwork,
} from '@chronobank/login/redux/network/actions'
import {
  AccountCustomNetwork,
} from '@chronobank/core/models/wallet/persistAccount'
import { ModalDialog } from 'components'
import NetworkCreateModalForm from './NetworkCreateModalForm'
import web3Utils from "../../../login/network/Web3Utils";
import Web3 from "web3";
import web3Provider from "../../../login/network/Web3Provider";

function mapDispatchToProps (dispatch) {
  return {
    handleCloseModal: () => dispatch(modalsClose()),
    handleSubmitCreateNetwork: (url, alias) => dispatch(handleSubmitCreateNetwork(url, alias)),
    handleSubmitEditNetwork: (network) => dispatch(handleSubmitEditNetwork(network)),
    handleDeleteNetwork: (network) => dispatch(handleDeleteNetwork(network)),
  }
}

@connect(null, mapDispatchToProps)
export default class NetworkCreateModal extends PureComponent {
  static propTypes = {
    handleCloseModal: PropTypes.func,
    handleSubmitCreateNetwork: PropTypes.func,
    handleSubmitEditNetwork: PropTypes.func,
    handleDeleteNetwork: PropTypes.func,
    network: PropTypes.instanceOf(AccountCustomNetwork),
  }

  static defaultProps = {
    network: null,
  }

  resolveNetwork(){
    const web3 = new Web3()
    web3Provider.reinit(web3, web3Utils.createStatusEngine(this.props.getProviderURL()))
    web3Provider.resolve()
  }

  handleSubmitSuccess = () => {
    this.props.handleCloseModal()
  }

  handleSubmit(values){
    const { handleSubmitCreateNetwork, handleSubmitEditNetwork, network } = this.props

    const url = values.get('url')
    const alias = values.get('alias')

    console.log('handle', values, url, alias, network)
    if (network){

      const networkModel = new AccountCustomNetwork({
        ...network,
        url,
        name: alias,
      })

      handleSubmitEditNetwork(networkModel)
    } else {
      handleSubmitCreateNetwork(url, alias)
    }
  }

  handleDeleteNetwork(){
    const { network, handleDeleteNetwork } = this.props

    if (network){
      handleDeleteNetwork(network)
    }

    this.props.handleCloseModal()
  }

  render () {
    const { network } = this.props

    return (
      <ModalDialog title='Add a Network'>
        <NetworkCreateModalForm
          onSubmit={this.handleSubmit.bind(this)}
          onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
          onCloseModal={this.props.handleCloseModal}
          network={network}
          initialValues={{
            url: network && network.url,
            alias: network && network.name,
          }}
          handleDeleteNetwork={this.handleDeleteNetwork.bind(this)}
        />
      </ModalDialog>
    )
  }
}
