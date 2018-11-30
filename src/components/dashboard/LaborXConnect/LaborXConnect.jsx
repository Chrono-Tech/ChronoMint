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
  getLXDeposit, getLXLockedDeposit, getLXToken,
  getMainLaborHourWallet,
  getMiningParams,
} from '@chronobank/core/redux/laborHour/selectors/mainSelectors'
import {
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
import { updateMiningNodeType } from '@chronobank/core/redux/laborHour/actions'
import { FORM_LABOR_X_CONNECT_SETTINGS } from 'components/constants'
import { startMiningInCustomNode, unlockLockedDeposit } from '@chronobank/core/redux/laborHour/thunks/mining'
import { sidechainWithdraw } from '@chronobank/core/redux/laborHour/thunks/sidechainToMainnet'
import { estimateGasForForms } from '@chronobank/core/redux/laborHour/thunks/utilsThunks'
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
  const delegateAddress = selector(state, 'delegateAddress')

  // state
  const wallet: WalletModel = getMainEthWallet(state)
  const lhtWallet: WalletModel = getMainLaborHourWallet(state)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const tokens = state.get(DUCK_TOKENS)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  const token = tokens.item(tokenId)
  const timeTokenLX = getLXToken(TIME)(state)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const balance = wallet.balances[tokenId] || new Amount(0, tokenId)
  const balanceEth = wallet.balances[ETH] || new Amount(0, ETH)
  const assets = assetHolder.assets()
  const spender = assetHolder.wallet()
  const miningParams = getMiningParams(state)
  const lxDeposit = getLXDeposit(lhtWallet.address)(state)
  const lxLockedDeposit = getLXLockedDeposit(lhtWallet.address)(state)

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
    timeTokenLX,
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
    lxDeposit,
    lxLockedDeposit,
    delegateAddress,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    lockDeposit: (amount, token, isCustomNode, delegateAddress, feeMultiplier) =>
      dispatch(lockDeposit(amount, token, isCustomNode, delegateAddress, feeMultiplier)),
    sidechainWithdraw: (amount, token, isCustomNode, delegateAddress, feeMultiplier) =>
      dispatch(sidechainWithdraw(amount, token, isCustomNode, delegateAddress, feeMultiplier)),
    onChangeField: (field, value) => dispatch(change(ownProps.formName, field, value)),
    handleEstimateGas: (params, callback) =>
      dispatch(estimateGasForForms(params, callback)),
    handleUnlockDeposit: (token, feeMultiplier) => {
      dispatch(updateMiningNodeType({ isCustomNode: false, delegateAddress: null }))
      dispatch(unlockLockedDeposit(token, feeMultiplier))
    },
    handleStartMiningInCustomNode: (delegateAddress, feeMultiplier) => dispatch(startMiningInCustomNode(delegateAddress, feeMultiplier)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LaborXConnect extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    lockDeposit: PropTypes.func,
    sidechainWithdraw: PropTypes.func,
    balanceEth: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    timeTokenLX: PropTypes.instanceOf(TokenModel),
    assets: PropTypes.instanceOf(AssetsCollection),
    initAssetsHolder: PropTypes.func,
    handleSubmitSuccess: PropTypes.func,
    onChangeField: PropTypes.func,
    amount: PropTypes.number,
    formName: PropTypes.string,
    lhtWallet: PropTypes.instanceOf(WalletModel),
    miningParams: PropTypes.shape({
      minDepositLimit: PropTypes.string,
      rewardsCoefficient: PropTypes.string,
      isCustomNode: PropTypes.bool,
    }),
    isCustomNode: PropTypes.bool,
    handleUnlockDeposit: PropTypes.func,
    handleStartMiningInCustomNode: PropTypes.func,
    onCloseModal: PropTypes.func,
    lxDeposit: PropTypes.instanceOf(Amount),
    lxLockedDeposit: PropTypes.instanceOf(Amount),
    feeMultiplier: PropTypes.number,
    delegateAddress: PropTypes.string,
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

  handleGetGasPrice = (params) => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({ feeLoading: true })
      this.props.handleEstimateGas(params, this.feeCallback)
    }, 1000)
  }

  handleSubmit = (values) => {
    const token = values.get('token')
    const amount = values.get('amount')
    const feeMultiplier = values.get('feeMultiplier') || 1
    const isCustomNode = values.get('isCustomNode')
    const delegateAddress = values.get('delegateAddress')

    switch (values.get('action')) {
      case TX_LOCK:
        this.props.onCloseModal()
        return this.props.lockDeposit(
          new Amount(amount, token.id()),
          token,
          !!isCustomNode,
          delegateAddress,
          feeMultiplier,
        )
      case TX_UNLOCK:
        this.props.onCloseModal()
        return this.props.sidechainWithdraw(
          new Amount(amount, token.id()),
          token,
          !!isCustomNode,
          delegateAddress,
          feeMultiplier,
        )
      case TX_DEPOSIT:
        this.props.onCloseModal()
        return this.props.handleUnlockDeposit(token, feeMultiplier)
      case TX_START_MINING_IN_CUSTOM_NODE:
        this.props.onCloseModal()
        return this.props.handleStartMiningInCustomNode(delegateAddress, feeMultiplier)
    }
  }

  handleSubmitSuccess = () => {
    if (typeof this.props.handleSubmitSuccess === 'function') {
      this.props.handleSubmitSuccess()
    }
  }

  feeCallback = (error, result) => {
    const { gasFee, gasPrice } = result
    if (!error) {
      this.setState({
        gasFee,
        gasPrice,
        feeLoading: false,
      })
    } else {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  render () {
    const {
      amount,
      assets,
      token,
      timeTokenLX,
      deposit,
      balanceEth,
      onChangeField,
      formName,
      lhtWallet,
      miningParams,
      isCustomNode,
      lxDeposit,
      lxLockedDeposit,
      feeMultiplier,
      delegateAddress,
    } = this.props
    const { gasFee, gasPrice, feeLoading } = this.state

    let Component
    switch (formName) {
      case FORM_LABOR_X_CONNECT_SETTINGS:
        Component = LaborXConnectSettingsForm
        break
      default:
        Component = LaborXConnectForm
        break
    }

    const miningBalance = new Amount(lhtWallet.balances[TIME] || 0, TIME)
      .plus(lxDeposit || 0)
      .plus(lxLockedDeposit || 0)

    const firstAsset = assets.first()
    return (
      <Component
        feeMultiplier={feeMultiplier}
        miningParams={miningParams}
        feeLoading={feeLoading}
        gasFee={gasFee}
        gasPrice={gasPrice}
        amount={amount}
        onChangeField={onChangeField}
        deposit={deposit}
        balanceEth={balanceEth}
        token={token}
        timeTokenLX={timeTokenLX}
        miningBalance={miningBalance}
        assets={assets}
        initialValues={{
          amount: miningBalance.toNumber(),
          isCustomNode: lxLockedDeposit.gt(0),
          symbol: firstAsset.symbol(),
          feeMultiplier: 1,
        }}
        onSubmit={this.handleSubmit}
        onSubmitSuccess={this.handleSubmitSuccess}
        isCustomNode={isCustomNode}
        onEstimateFee={this.handleGetGasPrice}
        delegateAddress={delegateAddress}
      />
    )
  }
}
