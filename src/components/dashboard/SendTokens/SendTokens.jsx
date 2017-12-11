import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import { getCurrentWallet } from 'redux/wallet/actions'
import { mainTransfer, mainApprove } from 'redux/mainWallet/actions'
import { multisigTransfer } from 'redux/multisigWallet/actions'
import SendTokensForm, { ACTION_TRANSFER, ACTION_APPROVE, FORM_SEND_TOKENS } from 'components/dashboard/SendTokens/SendTokensForm'

function mapDispatchToProps (dispatch) {
  return {
    multisigTransfer: (wallet, token, amount, recipient) => dispatch(multisigTransfer(wallet, token, amount, recipient)),
    mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender)),
    mainTransfer: (token, amount, recipient) => dispatch(mainTransfer(token, amount, recipient)),
    resetForm: () => dispatch(reset(FORM_SEND_TOKENS)),
  }
}

function mapStateToProps (state) {
  return {
    wallet: getCurrentWallet(state),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.object,
    multisigTransfer: PropTypes.func,
    mainApprove: PropTypes.func,
    mainTransfer: PropTypes.func,
    resetForm: PropTypes.func,
  }

  handleSubmit = (values) => {
    const { wallet, resetForm } = this.props
    const { action, symbol, amount, recipient } = values.toJS()
    const token = wallet.tokens().get(symbol)

    resetForm()

    switch (action) {
      case ACTION_APPROVE:
        return !wallet.isMultisig() && this.props.mainApprove(token, amount, recipient)
      case ACTION_TRANSFER:
        return wallet.isMultisig()
          ? this.props.multisigTransfer(wallet, token, amount, recipient)
          : this.props.mainTransfer(token, amount, recipient)
    }
  }

  render () {
    const { wallet } = this.props
    const initialValues = {}
    if (wallet.balances().size() > 0) {
      initialValues.symbol = wallet.balances().first().id()
    }

    console.log('--SendTokens#render', wallet.toJS())
    return (
      <SendTokensForm
        initialValues={initialValues}
        wallet={wallet}
        onSubmit={this.handleSubmit}
      />
    )
  }
}

