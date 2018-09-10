/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { addOwner, removeOwner } from '@chronobank/core/redux/multisigWallet/actions'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import EditManagersBaseForm from 'components/forms/EditManagersBaseForm/EditManagersBaseForm'
import ModalDialog from 'components/dialogs/ModalDialog'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    handleRemoveOwner: (wallet, address) => dispatch(removeOwner(wallet, address)),
    handleAddOwner: (wallet, address) => dispatch(addOwner(wallet, address)),
  }
}

@connect(null, mapDispatchToProps)
class EditManagersDialog extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigEthWalletModel),
    modalsClose: PropTypes.func,
    handleRemoveOwner: PropTypes.func,
    handleAddOwner: PropTypes.func,
  }

  handleRemove = (address) => {
    this.props.modalsClose()
    this.props.handleRemoveOwner(this.props.wallet, address)
  }

  handleAdd = (address) => {
    this.props.modalsClose()
    this.props.handleAddOwner(this.props.wallet, address)
  }

  render () {
    return (
      <ModalDialog>
        <EditManagersBaseForm
          managers={this.props.wallet.owners()}
          onRemove={this.handleRemove}
          onSubmitSuccess={this.handleAdd}
        />
      </ModalDialog>
    )
  }
}

export default EditManagersDialog
