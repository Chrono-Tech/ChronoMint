import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change, untouch } from 'redux-form'
import { getCurrentWallet } from 'redux/wallet/actions'
import { mainTransfer, mainApprove } from 'redux/mainWallet/actions'
import { multisigTransfer } from 'redux/multisigWallet/actions'
import SendTokensForm, { ACTION_TRANSFER, ACTION_APPROVE, FORM_SEND_TOKENS } from 'components/dashboard/SendTokens/SendTokensForm'

function mapDispatchToProps (dispatch) {
  return {
    multisigTransfer: (wallet, token, amount, recipient) => dispatch(multisigTransfer(wallet, token, amount, recipient)),
    mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender)),
    mainTransfer: (token, amount, recipient, feeMultiplier) => dispatch(mainTransfer(token, amount, recipient, feeMultiplier)),
    resetForm: () => {
      dispatch(change(FORM_SEND_TOKENS, 'recipient', ''))
      dispatch(change(FORM_SEND_TOKENS, 'amount', ''))
      dispatch(untouch(FORM_SEND_TOKENS, 'recipient', 'amount'))
    },
  }
}

function mapStateToProps (state) {
  return {
    wallet: getCurrentWallet(state),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class SendTokens extends PureComponent {
  static propTypes = {
    wallet: PropTypes.object,
    multisigTransfer: PropTypes.func,
    mainApprove: PropTypes.func,
    mainTransfer: PropTypes.func,
    resetForm: PropTypes.func,
  }

  constructor (props) {
    super(props)
    const { wallet } = props
    this.state = {
      symbol: wallet.tokens().size > 0
        ? wallet.tokens().first().symbol()
        : null,
    }
  }

  componentWillReceiveProps (newProps) {
    const { wallet } = newProps
    const selectedToken = wallet.tokens().get(this.state.symbol)
    if (!selectedToken) {
      this.state.symbol = wallet.tokens().size > 0
        ? wallet.tokens().first().symbol()
        : null
    }
  }

  handleSubmit = (values) => {
    const { wallet, resetForm } = this.props
    const { action, symbol, amount, recipient, feeMultiplier } = values.toJS()
    const token = wallet.tokens().get(symbol)

    resetForm()

    switch (action) {
      case ACTION_APPROVE:
        return !wallet.isMultisig() && this.props.mainApprove(token, amount, recipient)
      case ACTION_TRANSFER:
        return wallet.isMultisig()
          ? this.props.multisigTransfer(wallet, token, amount, recipient, feeMultiplier)
          : this.props.mainTransfer(token, amount, recipient, feeMultiplier)
    }
  }

  render () {
    const { wallet } = this.props
    const symbol = wallet.tokens().size > 0
      ? wallet.tokens().first().symbol()
      : undefined
    return (
      <SendTokensForm
        initialValues={{ symbol, feeMultiplier: 1 }}
        wallet={wallet}
        onSubmit={this.handleSubmit}
      />
    )
  }
}

export default SendTokens
