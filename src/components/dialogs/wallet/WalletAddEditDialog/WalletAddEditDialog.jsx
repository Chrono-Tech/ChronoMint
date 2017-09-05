import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import ModalDialog from '../../ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import * as actions from 'redux/wallet/actions'

import WalletAddEditForm from './WalletAddEditForm'

import WalletModel from '../../../../models/wallet/WalletModel'

const TRANSITION_TIMEOUT = 250

function mapStateToProps (state) {
  return {
    isAddNotEdit: state.get('wallet').isAddNotEdit
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    },
    addWallet: (wallet: WalletModel) => dispatch(actions.addWallet(wallet)),
    updateWallet: (wallet: WalletModel) => dispatch(actions.updateWallet(wallet)),
    closeModal: () => dispatch(modalsClose())
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class WalletAddEditDialog extends React.Component {
  /** @namespace PropTypes.func */
  /** @namespace PropTypes.bool */
  /** @namespace PropTypes.string */
  /** @namespace PropTypes.object */
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    submitting: PropTypes.bool,
    isEditMultisig: PropTypes.bool,
    isAddNotEdit: PropTypes.bool,
    addWallet: PropTypes.func,
    updateWallet: PropTypes.func,
    closeModal: PropTypes.func,
    wallet: PropTypes.object
  }

  static defaultProps = {
    isAddNotEdit: true,
    isEditMultisig: true,
    wallet: new WalletModel()
  }

  handleSubmitSuccess = (wallet: WalletModel) => {
    this.props.closeModal()
    if (this.props.isAddNotEdit) {
      this.props.addWallet(wallet)
    } else {
      this.props.updateWallet(wallet)
    }
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}>
        <ModalDialog onClose={() => this.props.onClose()}>
          <WalletAddEditForm
            wallet={this.props.wallet}
            onSubmitSuccess={this.handleSubmitSuccess}
          />
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}
