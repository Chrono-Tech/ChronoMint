/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import icnWalletDialogWhite from 'assets/img/icn-wallet-dialog-white.svg'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import { createWallet } from 'redux/multisigWallet/actions'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import WalletAddEditForm from './WalletAddForm'
import { prefix } from './lang'
import './WalletAddForm.scss'

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
    wallet: PropTypes.instanceOf(MultisigWalletModel),
  }

  handleSubmitSuccess = (wallet: MultisigWalletModel) => {
    this.props.modalsClose()
    this.props.createWallet(wallet)
  }

  render () {
    return (
      <ModalDialog
        title={(
          <div styleName='header'>
            <img styleName='headerIcon' src={icnWalletDialogWhite} alt='' />
            <Translate styleName='headerTitle' value={`${prefix}.createNewWallet`} />
          </div>
        )}
      >
        <WalletAddEditForm
          initialValues={this.props.wallet.toAddFormJS()}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialog>
    )
  }
}
