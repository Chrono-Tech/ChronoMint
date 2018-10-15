/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { change, formValueSelector } from 'redux-form/immutable'
import { DUCK_ASSETS_HOLDER } from '@chronobank/core/redux/assetsHolder/constants'
import { ETH } from '@chronobank/core/dao/constants'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import AllowanceModel from '@chronobank/core/models/wallet/AllowanceModel'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { estimateGasForAssetHolder, initAssetsHolder, lockDeposit } from '@chronobank/core/redux/assetsHolder/actions'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { TX_LOCK, TX_UNLOCK } from '@chronobank/core/dao/constants/AssetHolderDAO'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import { FORM_LABOR_X_CONNECT } from 'components/constants'
import LaborXConnectForm from './LaborXConnectForm'
import './LaborXConnect.scss'

function mapStateToProps (state) {
  // form
  const selector = formValueSelector(FORM_LABOR_X_CONNECT)
  const tokenId = selector(state, 'symbol')
  const amount = Number.parseFloat(selector(state, 'amount') || 0)
  const feeMultiplier = selector(state, 'feeMultiplier')

  // state
  const wallet: WalletModel = getMainEthWallet(state)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const tokens = state.get(DUCK_TOKENS)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  const token = tokens.item(tokenId)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const balance = wallet.balances[tokenId] || new Amount(0, tokenId)
  const balanceEth = wallet.balances[ETH] || new Amount(0, ETH)
  const assets = assetHolder.assets()
  const spender = assetHolder.wallet()

  return {
    wallet,
    balance,
    balanceEth,
    deposit: assets.item(token.address()).deposit(),
    allowance: wallet.allowances.list[`${spender}-${token.id()}`] || new AllowanceModel(),
    spender,
    amount,
    token,
    feeMultiplier,
    tokens,
    assets,
    isShowTIMERequired: isTesting && !wallet.isTIMERequired && balance.isZero() && token.symbol() === 'TIME',
    account: state.get(DUCK_SESSION).account,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    lockDeposit: (amount, token) => dispatch(lockDeposit(amount, token)),
    onChangeField: (field, value) => dispatch(change(FORM_LABOR_X_CONNECT, field, value)),
    handleEstimateGas: (mode, params, callback, gasPriceMultiplier) => dispatch(estimateGasForAssetHolder(mode, params, callback, gasPriceMultiplier)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LaborXConnect extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    lockDeposit: PropTypes.func,
    balanceEth: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    assets: PropTypes.instanceOf(AssetsCollection),
    initAssetsHolder: PropTypes.func,
    handleSubmitSuccess: PropTypes.func,
    onChangeField: PropTypes.func,
    amount: PropTypes.number,
  }

  constructor (props) {
    super(props)
    this.state = {
      feeLoading: false,
    }
    this.timeout = null
  }

  componentDidMount () {
    this.props.initAssetsHolder()
  }

  componentWillReceiveProps (newProps) {
    const firstAsset = newProps.assets.first()
    this.props.onChangeField('symbol', firstAsset.symbol())

    if (newProps.amount > 0 && newProps.amount !== this.props.amount && newProps.token.isFetched) {
      this.handleGetGasPrice(TX_LOCK, newProps.amount, newProps.token)
    }
  }

  handleGetGasPrice = (action: string, amount: number, token: string, feeMultiplier: number) => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({ feeLoading: true })
      this.props.handleEstimateGas(
        action,
        [token.address(), amount],
        (error, result) => {
          const { gasFee } = result
          if (!error) {
            this.setState({
              gasFee,
              feeLoading: false,
            })
          } else {
            // eslint-disable-next-line
            console.error(error)
          }
        },
        feeMultiplier,
      )
    }, 1000)
  }

  handleSubmit = (values) => {
    const token = values.get('token')
    const amount = new Amount(token.addDecimals(values.get('amount')), token.id())
    const feeMultiplier = values.get('feeMultiplier') || 1

    switch (values.get('action')) {
      case TX_LOCK:
        this.props.lockDeposit(amount, token, feeMultiplier)
        break
      case TX_UNLOCK:
        // TODO @Abdulov implement the method
        break
    }
  }

  handleSubmitSuccess = () => {
    if (typeof this.props.handleSubmitSuccess === 'function') {
      this.props.handleSubmitSuccess()
    }
  }

  render () {
    const { amount, assets, token, deposit, balanceEth, onChangeField } = this.props
    const { gasFee, feeLoading } = this.state

    return (
      <LaborXConnectForm
        feeLoading={feeLoading}
        gasFee={gasFee}
        amount={amount}
        onChangeField={onChangeField}
        deposit={deposit}
        balanceEth={balanceEth}
        token={token}
        assets={assets}
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
      />
    )
  }
}
