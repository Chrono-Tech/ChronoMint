import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import { createWallet, updateWallet } from 'redux/multisigWallet/actions'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import WalletAddEditForm from './WalletAddEditForm'

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => dispatch(modalsClose()),
    createWallet: (wallet: MultisigWalletModel) => dispatch(createWallet(wallet)),
    updateWallet: (wallet: MultisigWalletModel) => dispatch(updateWallet(wallet)),
    closeModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class WalletAddEditDialog extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    createWallet: PropTypes.func,
    updateWallet: PropTypes.func,
    closeModal: PropTypes.func,
    wallet: PropTypes.object,
  }

  handleSubmitSuccess = (wallet: MultisigWalletModel) => {
    this.props.closeModal()
    wallet.isNew()
      ? this.props.createWallet(wallet)
      : this.props.updateWallet(wallet)
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
