import Amount from 'models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { depositAsset, initAssetsHolder, withdrawAsset } from 'redux/assetsHolder/actions'
import { mainApprove } from 'redux/mainWallet/actions'
import DepositTokensForm, { ACTION_APPROVE, ACTION_DEPOSIT, ACTION_WITHDRAW } from './DepositTokensForm'
import './DepositTokensForm.scss'

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender)),
    depositAsset: (amount, token) => dispatch(depositAsset(amount, token)),
    withdrawAsset: (amount) => dispatch(withdrawAsset(amount)),
  }
}

@connect(null, mapDispatchToProps)
export default class DepositTokens extends PureComponent {
  static propTypes = {
    initAssetsHolder: PropTypes.func,
    mainApprove: PropTypes.func,
    depositAsset: PropTypes.func,
    withdrawAsset: PropTypes.func,
  }

  componentWillMount () {
    this.props.initAssetsHolder()
  }

  handleSubmit = (values) => {
    const token = values.get('token')
    const amount = new Amount(token.addDecimals(values.get('amount')), token.id())

    switch (values.get('action')) {
      case ACTION_APPROVE:
        this.props.mainApprove(token, amount, values.get('spender'))
        break
      case ACTION_DEPOSIT:
        this.props.depositAsset(amount)
        break
      case ACTION_WITHDRAW:
        this.props.withdrawAsset(amount)
        break
    }
  }

  handleSubmitSuccess = () => {
    // reset form here
  }

  render () {
    return (
      <DepositTokensForm
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
      />
    )
  }
}
