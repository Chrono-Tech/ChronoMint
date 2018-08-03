/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsClose } from 'redux/modals/actions'
import Button from 'components/common/ui/Button/Button'
import {
  handleSubmitCreateNetwork,
  handleSubmitEditNetwork,
  handleDeleteNetwork,
} from '@chronobank/login/redux/network/thunks'
import {
  AccountCustomNetwork,
} from '@chronobank/core/models/wallet/persistAccount'
import { ModalDialog } from 'components'

import './NetworkDeleteModal.scss'

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

  handleDeleteNetwork(){
    const { network, handleDeleteNetwork, handleCloseModal } = this.props

    if (network){
      handleDeleteNetwork(network)
      handleCloseModal()
    }
  }

  renderNetworkAddress(){
    const { network } = this.props

    return (
      <div styleName='network-info'>
        <div>
          Address:<br />
          {network.url}
        </div>
        <div>
          Name:<br />
          {network.name}
        </div>
      </div>
    )
  }

  render () {
    const { network, handleSubmit, handleCloseModal } = this.props

    return (
      <ModalDialog title={<Translate value='NetworkDeleteModal.title' />}>
        <div styleName='form' >
          <div styleName='description'>
            You&apos;re about to delete <br />
            {this.renderNetworkAddress()}
            <b>Are you sure?</b>
          </div>

          <div styleName='actions'>
            <Button
              styleName='button buttonNo'
              buttonType='flat'
              onClick={handleCloseModal}
              label={
                <Translate value='NetworkDeleteModal.no' />
              }
            />
            <Button
              styleName='button buttonYes'
              buttonType='login'
              onClick={this.handleDeleteNetwork.bind(this)}
              label={<Translate value='NetworkDeleteModal.yes' />}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
