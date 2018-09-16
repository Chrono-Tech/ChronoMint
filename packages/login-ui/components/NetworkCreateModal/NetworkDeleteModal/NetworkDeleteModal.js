/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import Button from 'components/common/ui/Button/Button'
import {
  customNetworkEdit,
  customNetworksDelete,
  customNetworkCreate,
} from '@chronobank/core/redux/persistAccount/actions'
import {
  AccountCustomNetwork,
} from '@chronobank/core/models/wallet/persistAccount'
import ModalDialog from 'components/dialogs/ModalDialog'

import './NetworkDeleteModal.scss'

function mapDispatchToProps (dispatch) {
  return {
    handleCloseModal: () => dispatch(modalsClose()),
    handleSubmitCreateNetwork: (url, alias) => dispatch(customNetworkCreate(url, alias)),
    handleSubmitEditNetwork: (network) => dispatch(customNetworkEdit(network)),
    handleDeleteNetwork: (network) => dispatch(customNetworksDelete(network)),
  }
}

@connect(null, mapDispatchToProps)
export default class NetworkCreateModal extends PureComponent {
  static propTypes = {
    handleCloseModal: PropTypes.func,
    handleDeleteNetwork: PropTypes.func,
    network: PropTypes.instanceOf(AccountCustomNetwork),
  }

  static defaultProps = {
    network: null,
  }

  handleDeleteNetwork = () => {
    const { network, handleDeleteNetwork, handleCloseModal } = this.props

    if (network){
      handleDeleteNetwork(network)
      handleCloseModal()
    }
  }

  renderNetworkAddress (){
    const { network } = this.props

    return (
      <div styleName='network-info'>
        <div>
          Address:<br />
          {network.url}
        </div>
        <div>
          Socket:<br />
          {network.ws}
        </div>
        <div>
          Name:<br />
          {network.name}
        </div>
      </div>
    )
  }

  render () {
    const { handleCloseModal } = this.props

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
              onClick={this.handleDeleteNetwork}
              label={<Translate value='NetworkDeleteModal.yes' />}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
