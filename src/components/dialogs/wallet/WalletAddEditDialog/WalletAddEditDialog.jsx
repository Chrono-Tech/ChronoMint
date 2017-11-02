import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import { createWallet } from 'redux/multisigWallet/actions'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import WalletAddEditForm from './WalletAddEditForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => dispatch(modalsClose()),
    createWallet: (wallet: MultisigWalletModel) => dispatch(createWallet(wallet)),
    closeModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class WalletAddEditDialog extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    createWallet: PropTypes.func,
    closeModal: PropTypes.func,
    wallet: PropTypes.object,
  }

  handleSubmitSuccess = (wallet: MultisigWalletModel) => {
    this.props.closeModal()
    this.props.createWallet(wallet)
  }

  render () {
    return (
      <ModalDialog onClose={() => this.props.onClose()}>
        <WalletAddEditForm
          initialValues={this.props.wallet.toAddEditFormJS()}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialog>
    )
  }
}
