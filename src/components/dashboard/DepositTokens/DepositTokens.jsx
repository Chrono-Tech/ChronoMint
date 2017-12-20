import DepositTokensForm from 'components/dashboard/DepositTokens/DepositTokensForm'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { initAssetsHolder } from 'redux/assetsHolder/actions'
import { updateIsTIMERequired } from 'redux/mainWallet/actions'
import './DepositTokensForm.scss'

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    updateRequireTIME: () => dispatch(updateIsTIMERequired()),
    // mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender)),
    // depositAsset: (amount, token) => dispatch(depositAsset(amount, token)),
    // withdrawAsset: (amount) => dispatch(withdrawAsset(amount)),
    // requireTIME: () => dispatch(requireTIME()),
  }
}

@connect(null, mapDispatchToProps)
export default class DepositTokens extends PureComponent {
  static propTypes = {
    initAssetsHolder: PropTypes.func,
    updateRequireTIME: PropTypes.func,
  }

  componentWillMount () {
    this.props.initAssetsHolder()
    // TODO @dkchv: !!! move to asset holders' subscription
    this.props.updateRequireTIME()
  }

  handleSubmit = (values) => {
    console.log('--DepositTokens#handleSubmit', 1, values.toJS())
  }

  handleSubmitSuccess = (values) => {
    console.log('--DepositTokens#handleSubmitSuccess', 2, values.toJS())
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
