import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import { createWallet, updateWallet } from 'redux/multisigWallet/actions'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from '../../ModalDialog'
import WalletAddEditForm from './WalletAddEditForm'

const TRANSITION_TIMEOUT = 250

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    },
    createWallet: (wallet: MultisigWalletModel) => dispatch(createWallet(wallet)),
    updateWallet: (wallet: MultisigWalletModel) => dispatch(updateWallet(wallet)),
    closeModal: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class WalletAddEditDialog extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    submitting: PropTypes.bool,
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

  handleSubmitFail = () => {
    // TODO @dkchv: !!!
  }

  render () {
    console.log('--WalletAddEditDialog#render', this.props.wallet.toJS())
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        <ModalDialog onClose={() => this.props.onClose()}>
          <WalletAddEditForm
            initialValues={this.props.wallet.toAddEditFormJS()}
            onSubmitSuccess={this.handleSubmitSuccess}
            onSubmitFail={this.handleSubmitFail}
          />
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}
