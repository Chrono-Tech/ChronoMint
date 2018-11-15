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
import { ETH, TIME } from '@chronobank/core/dao/constants'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import AllowanceModel from '@chronobank/core/models/wallet/AllowanceModel'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import {
  getMainLaborHourWallet,
  getMiningParams,
} from '@chronobank/core/redux/laborHour/selectors/mainSelectors'
import {
  estimateGasForAssetHolder,
  initAssetsHolder,
  lockDeposit,
} from '@chronobank/core/redux/assetsHolder/actions'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import {
  TX_LOCK,
  TX_UNLOCK,
} from '@chronobank/core/dao/constants/AssetHolderDAO'
import {
  TX_DEPOSIT,
  TX_START_MINING_IN_CUSTOM_NODE,
} from '@chronobank/core/redux/laborHour/dao/TimeHolderDAO'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import { FORM_LABOR_X_CONNECT_SETTINGS } from 'components/constants'
import { startMiningInCustomNode, startMiningInPoll } from '@chronobank/core/redux/laborHour/thunks/mining'
import { sidechainWithdraw } from '@chronobank/core/redux/laborHour/thunks/sidechainToMainnet'
import LaborXConnectForm from './LaborXConnectForm'
import './LaborXConnect.scss'
import LaborXConnectSettingsForm from './LaborXConnectSettingsForm'

function mapStateToProps (state, ownProps) {
  // form
  const selector = formValueSelector(ownProps.formName)
  const tokenId = selector(state, 'symbol')
  const amount = Number.parseFloat(selector(state, 'amount') || 0)
  const feeMultiplier = selector(state, 'feeMultiplier')
  const isCustomNode = selector(state, 'isCustomNode')

  // state
  const wallet: WalletModel = getMainEthWallet(state)
  const lhtWallet: WalletModel = getMainLaborHourWallet(state)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const tokens = state.get(DUCK_TOKENS)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  const token = tokens.item(tokenId)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const balance = wallet.balances[tokenId] || new Amount(0, tokenId)
  const balanceEth = wallet.balances[ETH] || new Amount(0, ETH)
  const assets = assetHolder.assets()
  const spender = assetHolder.wallet()
  const miningParams = getMiningParams(state)

  return {
    wallet,
    lhtWallet,
    balance,
    balanceEth,
    deposit: assets.item(token.address()).deposit(),
    allowance:
      wallet.allowances.list[`${spender}-${token.id()}`] ||
      new AllowanceModel(),
    spender,
    amount,
    token,
    feeMultiplier,
    tokens,
    assets,
    isShowTIMERequired:
      isTesting &&
      !wallet.isTIMERequired &&
      balance.isZero() &&
      token.symbol() === 'TIME',
    account: state.get(DUCK_SESSION).account,
    miningParams,
    isCustomNode,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    lockDeposit: (amount, token) => dispatch(lockDeposit(amount, token)),
    sidechainWithdraw: (amount, token) =>
      dispatch(sidechainWithdraw(amount, token)),
    onChangeField: (field, value) =>
      dispatch(change(ownProps.formName, field, value)),
    handleEstimateGas: (mode, params, callback, gasPriceMultiplier) =>
      dispatch(
        estimateGasForAssetHolder(mode, params, callback, gasPriceMultiplier),
      ),
    handleStartMiningInPool: () => dispatch(startMiningInPoll()),
    handleStartMiningInCustomNode: ()=> dispatch(startMiningInCustomNode()),
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class LaborXConnect extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    lockDeposit: PropTypes.func,
    sidechainWithdraw: PropTypes.func,
    balanceEth: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    assets: PropTypes.instanceOf(AssetsCollection),
    initAssetsHolder: PropTypes.func,
    handleSubmitSuccess: PropTypes.func,
    onChangeField: PropTypes.func,
    amount: PropTypes.number,
    formName: PropTypes.string,
    lhtWallet: PropTypes.instanceOf(WalletModel),
    miningParams: PropTypes.objectOf(PropTypes.string),
    isCustomNode: PropTypes.bool,
    handleStartMiningInPool: PropTypes.func,
    handleStartMiningInCustomNode: PropTypes.func,
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
  }

  handleGetGasPrice = (
    action: string,
    amount: number,
    token: string,
    feeMultiplier: number,
  ) => {
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
    const amount = new Amount(values.get('amount'), token.id())
    const feeMultiplier = values.get('feeMultiplier') || 1
    const isCustomNode = values.get('isCustomNode')

    switch (values.get('action')) {
      case TX_LOCK:
        return this.props.lockDeposit(
          amount,
          token,
          !!isCustomNode,
          feeMultiplier,
        )
      case TX_UNLOCK:
        return this.props.sidechainWithdraw(
          amount,
          token,
          !!isCustomNode,
          feeMultiplier,
        )
      case TX_DEPOSIT:
        return this.props.handleStartMiningInPool()
      case TX_START_MINING_IN_CUSTOM_NODE:
        return this.props.handleStartMiningInCustomNode( )
    }
  }

  handleSubmitSuccess = () => {
    if (typeof this.props.handleSubmitSuccess === 'function') {
      this.props.handleSubmitSuccess()
    }
  }

  render () {
    const {
      amount,
      assets,
      token,
      deposit,
      balanceEth,
      onChangeField,
      formName,
      lhtWallet,
      miningParams,
      isCustomNode,
    } = this.props
    const { gasFee, feeLoading } = this.state

    let Component
    switch (formName) {
      case FORM_LABOR_X_CONNECT_SETTINGS:
        Component = LaborXConnectSettingsForm
        break
      default:
        Component = LaborXConnectForm
        break
    }
    return (
      <Component
        miningParams={miningParams}
        feeLoading={feeLoading}
        gasFee={gasFee}
        amount={amount}
        onChangeField={onChangeField}
        deposit={deposit}
        balanceEth={balanceEth}
        token={token}
        lhtWallet={lhtWallet}
        assets={assets}
        initialValues={{
          amount: lhtWallet.balances[TIME].toNumber(),
          isCustomNode: false,
        }}
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
        isCustomNode={isCustomNode}
      />
    )
  }
}
