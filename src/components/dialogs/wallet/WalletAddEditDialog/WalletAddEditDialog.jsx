import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import { createWallet } from 'redux/multisigWallet/actions'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import WalletAddEditForm from './WalletAddEditForm'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    createWallet: (wallet: MultisigWalletModel) => dispatch(createWallet(wallet)),
  }
}

@connect(null, mapDispatchToProps)
export default class WalletAddEditDialog extends PureComponent {
  static propTypes = {
    modalsClose: PropTypes.func,
    createWallet: PropTypes.func,
    wallet: PropTypes.object,
  }

  handleSubmitSuccess = (wallet: MultisigWalletModel) => {
    this.props.modalsClose()
    this.props.createWallet(wallet)
  }

  render () {
    return (
      <ModalDialog>
        <WalletAddEditForm
          initialValues={this.props.wallet.toAddEditFormJS()}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialog>
    )
  }
}
