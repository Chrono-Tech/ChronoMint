/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ModalDialog from 'components/dialogs/ModalDialog'
import EditSignaturesForm from 'components/dialogs/wallet/EditSignaturesDialog/EditSignaturesForm'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import { changeRequirement } from '@chronobank/core/redux/multisigWallet/actions'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    handleAddOwner: (wallet, newRequired) => dispatch(changeRequirement(wallet, newRequired)),
  }
}

@connect(null, mapDispatchToProps)
export default class EditSignaturesDialog extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigEthWalletModel),
    modalsClose: PropTypes.func,
    handleRemoveOwner: PropTypes.func,
    handleAddOwner: PropTypes.func,
  }

  handleSubmitSuccess = (newRequired) => {
    this.props.modalsClose()
    this.props.handleAddOwner(this.props.wallet, newRequired)
  }

  render () {
    return (
      <ModalDialog>
        <EditSignaturesForm
          initialValues={this.props.wallet.toRequiredSignaturesFormJS()}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialog>
    )
  }
}
