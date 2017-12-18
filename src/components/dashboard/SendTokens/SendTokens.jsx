import SendTokensForm, { ACTION_APPROVE, ACTION_TRANSFER, FORM_SEND_TOKENS } from 'components/dashboard/SendTokens/SendTokensForm'
import Amount from 'models/Amount'
import TokensCollection from 'models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change, untouch } from 'redux-form'
import { mainApprove, mainTransfer } from 'redux/mainWallet/actions'
import { multisigTransfer } from 'redux/multisigWallet/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { getCurrentWallet } from 'redux/wallet/actions'

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
    tokens: state.get(DUCK_TOKENS),
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
    tokens: PropTypes.instanceOf(TokensCollection),
  }

  constructor (props) {
    super(props)
    const balances = props.wallet.balances()
    this.state = {
      symbol: balances.size() > 0
        ? balances.first().id()
        : null,
    }
  }

  componentWillReceiveProps (newProps) {
    const balances = newProps.wallet.balances()
    const selectedToken = balances.item(this.state.symbol)
    if (!selectedToken) {
      this.state.symbol = balances.size() > 0
        ? balances.first().id()
        : null
    }
  }

  handleSubmit = (values) => {
    const { wallet, tokens } = this.props
    const { action, symbol, amount, recipient, feeMultiplier } = values.toJS()
    const token = tokens.item(symbol)

    const value = new Amount(token.addDecimals(amount), symbol)

    switch (action) {
      case ACTION_APPROVE:
        !wallet.isMultisig() && this.props.mainApprove(token, value, recipient)
        break
      case ACTION_TRANSFER:
        wallet.isMultisig()
          ? this.props.multisigTransfer(wallet, token, value, recipient, feeMultiplier)
          : this.props.mainTransfer(token, value, recipient, feeMultiplier)
    }
  }

  handleSubmitSuccess = () => {
    this.props.resetForm()
  }

  render () {
    const { wallet } = this.props
    const initialValues = {
      feeMultiplier: 1,
    }
    if (wallet.balances().size() > 0) {
      initialValues.symbol = wallet.balances().first().id()
    }

    return (
      <SendTokensForm
        initialValues={initialValues}
        wallet={wallet}
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
      />
    )
  }
}

