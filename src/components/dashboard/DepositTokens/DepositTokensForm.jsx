/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button, IPFSImage } from 'components'
import { TextField } from 'redux-form-material-ui'

import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import web3Converter from '@chronobank/core/utils/Web3Converter'
import { TOKEN_ICONS } from 'assets'
import { modalsOpen } from 'redux/modals/actions'
import BigNumber from 'bignumber.js'
import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Slider from 'components/common/Slider'
import Amount from '@chronobank/core/models/Amount'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_ASSETS_HOLDER } from '@chronobank/core/redux/assetsHolder/actions'
import { estimateGasForDeposit, ETH, FEE_RATE_MULTIPLIER, mainApprove, mainRevoke, requireTIME } from '@chronobank/core/redux/mainWallet/actions'
import { TX_DEPOSIT, TX_WITHDRAW_SHARES } from '@chronobank/core/dao/AssetHolderDAO'
import { TX_APPROVE } from '@chronobank/core/dao/ERC20DAO'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import AllowanceModel from '@chronobank/core/models/wallet/AllowanceModel'
import classnames from 'classnames'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/EthereumDAO'
import { getGasPriceMultiplier } from '@chronobank/core/redux/session/selectors'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import {
  FORM_DEPOSIT_TOKENS,
  ACTION_APPROVE,
  ACTION_DEPOSIT,
  ACTION_WITHDRAW,
} from 'components/constants'
import ReceiveTokenModal from '../ReceiveTokenModal/ReceiveTokenModal'
import './DepositTokensForm.scss'
import validate from './validate'

const DEPOSIT_FIRST = 'depositFirst'
const DEPOSIT_SECOND = 'depositSecond'
const WITHDRAW = 'withdraw'

function prefix (token) {
  return `components.DepositTokens.${token}`
}

function mapStateToProps (state) {
  // form
  const selector = formValueSelector(FORM_DEPOSIT_TOKENS)
  const tokenId = selector(state, 'symbol')
  const amount = selector(state, 'amount')
  const feeMultiplier = selector(state, 'feeMultiplier')

  // state
  const wallet: WalletModel = getMainEthWallet(state)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const tokens = state.get(DUCK_TOKENS)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  const token = tokens.item(tokenId)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const balance = wallet.balances[tokenId]
  const balanceEth = wallet.balances[ETH]
  const assets = assetHolder.assets()
  const spender = assetHolder.wallet()

  return {
    balance,
    balanceEth,
    deposit: assets.item(token.address()).deposit(),
    allowance: wallet.allowances.list[`${spender}-${token.id()}`] || new AllowanceModel(),
    spender,
    amount: Number.parseFloat(amount) || 0,
    token,
    feeMultiplier,
    tokens,
    assets,
    isShowTIMERequired: isTesting && !wallet.isTIMERequired && balance && balance.isZero() && token.symbol() === 'TIME',
    account: state.get(DUCK_SESSION).account,
    initialValues: {
      feeMultiplier: getGasPriceMultiplier(BLOCKCHAIN_ETHEREUM)(state),
    },
  }
}

function mapDispatchToProps (dispatch) {
  return {
    mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender, 2, {
      skipSlider: true,
    })),
    mainRevoke: (token, spender, feeMultiplier) => dispatch(mainRevoke(token, spender, feeMultiplier, {
      skipSlider: true,
    })),
    dispatch: dispatch,
    requireTIME: () => dispatch(requireTIME()),
    receiveToken: (tokenId, wallet) => dispatch(modalsOpen({ component: ReceiveTokenModal, props: { tokenId, wallet } })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_DEPOSIT_TOKENS, validate })
export default class DepositTokensForm extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    allowance: PropTypes.instanceOf(AllowanceModel),
    balance: PropTypes.instanceOf(Amount),
    balanceEth: PropTypes.instanceOf(Amount),
    isShowTIMERequired: PropTypes.bool,
    token: PropTypes.instanceOf(TokenModel),
    account: PropTypes.string,
    wallet: PropTypes.instanceOf(WalletModel),
    tokens: PropTypes.instanceOf(TokensCollection),
    selectedToken: PropTypes.string,
    assets: PropTypes.instanceOf(AssetsCollection),
    requireTIME: PropTypes.func,
    dispatch: PropTypes.func,
    mainApprove: PropTypes.func,
    mainRevoke: PropTypes.func,
    feeMultiplier: PropTypes.number,
    isWithdraw: PropTypes.bool,
    onCloseModal: PropTypes.func,
    ...formPropTypes,
  }

  constructor (props) {
    super(props)

    let step = DEPOSIT_FIRST
    if (this.props.allowance && this.props.allowance.amount().gt(0)) {
      step = DEPOSIT_SECOND
    }
    if (this.props.isWithdraw) {
      step = WITHDRAW
    }

    this.state = { step }
    this.timeout = null
  }

  componentWillReceiveProps (newProps) {
    const firstAsset = newProps.assets.first()
    if (!newProps.token.isFetched() && firstAsset) {
      this.props.dispatch(change(FORM_DEPOSIT_TOKENS, 'symbol', firstAsset.symbol()))
    }

    if (newProps.amount > 0 && newProps.feeMultiplier > 0 && (newProps.amount !== this.props.amount || newProps.feeMultiplier !== this.props.feeMultiplier)) {
      let action = null
      switch (this.state.step) {
        case DEPOSIT_FIRST:
          action = TX_APPROVE
          break
        case DEPOSIT_SECOND:
          action = TX_DEPOSIT
          break
        case WITHDRAW:
          action = TX_WITHDRAW_SHARES
          break
      }
      this.handleGetGasPrice(action, newProps.amount, newProps.feeMultiplier, this.props.spender)
    }

    if (!newProps.isWithdraw) {
      if (newProps.allowance && newProps.allowance.amount().gt(0)) {
        this.setState({
          step: DEPOSIT_SECOND,
        })
        this.props.dispatch(change(FORM_DEPOSIT_TOKENS, 'amount', newProps.token.removeDecimals(newProps.allowance.amount())))
      } else {
        this.setState({
          step: DEPOSIT_FIRST,
        })
      }
    }
  }

  handleGetGasPrice = (action: string, amount: number, feeMultiplier: number, spender: string) => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.props.dispatch(estimateGasForDeposit(
        action,
        [action, [spender, new BigNumber(amount)]],
        (error, r) => {
          const { gasFee, gasPrice } = r
          if (!error) {
            this.setState({ gasFee, gasPrice })
          } else {
            // eslint-disable-next-line
            console.error(error)
          }
        },
        feeMultiplier,
      ))
    }, 1000)
  }

  handleApproveAsset = (values) => {
    this.props.onSubmit(values
      .set('action', ACTION_APPROVE)
      .set('token', this.props.token)
      .set('spender', this.props.spender),
    )
  }

  handleRevokeAsset = () => {
    const { spender, feeMultiplier } = this.props
    this.props.mainRevoke(this.props.token, spender, feeMultiplier)
  }

  handleDepositAsset = (values) => {
    this.props.onSubmit(values
      .set('action', ACTION_DEPOSIT)
      .set('token', this.props.token),
    )
  }

  handleWithdrawAsset = (values) => {
    this.props.onSubmit(values
      .set('action', ACTION_WITHDRAW)
      .set('token', this.props.token),
    )
  }

  handleRequireTime = () => {
    this.props.onCloseModal()
    this.props.requireTIME()
  }

  handleReceiveToken = (tokenId, wallet) => () => {
    this.props.onCloseModal()
    this.props.receiveToken(tokenId, wallet)
  }

  getIsLockValid (amount) {
    const { balance, allowance } = this.props
    const limit = BigNumber.min(balance, allowance.amount())
    return limit.gte(amount)
  }

  renderHead () {
    const { deposit, allowance, token, balance } = this.props
    const symbol = token.symbol()
    return (
      <div styleName='head'>
        <div styleName='mainTitle'><Translate value={prefix(this.state.step === WITHDRAW ? 'withdraw' : 'depositTime')} /></div>
        <div styleName='icon'>
          <div styleName='imgWrapper'>
            <IPFSImage
              styleName='iconImg'
              multihash={token.icon()}
              fallback={TOKEN_ICONS[symbol]}
            />
          </div>
        </div>
        {token.isFetched() ? (
          <div styleName='headContent'>

            <div styleName='headItemWrapper'>
              {this.state.step === DEPOSIT_FIRST || this.state.step === WITHDRAW ? (
                <div styleName='headItem'>
                  <div styleName='headItemTitle'><Translate value={prefix('balanceAmount')} /></div>
                  <div styleName='balance'><TokenValue isInvert noRenderPrice value={balance} /></div>
                  <div styleName='balanceFiat'><TokenValue isInvert renderOnlyPrice value={balance} /></div>
                </div>
              ) : null}

              {this.state.step === DEPOSIT_SECOND || this.state.step === WITHDRAW ? (
                <div styleName='headItem'>
                  <div styleName='headItemTitle'><Translate value={prefix('depositAmount')} /></div>
                  <div styleName='balance'>
                    <TokenValue
                      isInvert
                      noRenderPrice
                      value={deposit}
                      noRenderSymbol={this.state.step === WITHDRAW}
                    />
                  </div>
                  <div styleName='balanceFiat'><TokenValue isInvert renderOnlyPrice value={deposit} /></div>
                </div>
              ) : null}

              {this.state.step === DEPOSIT_SECOND && (
                <div styleName='headItem'>
                  <div styleName='headItemTitle'><Translate value={prefix('changeAmount')} /></div>
                  <div styleName='balance'><TokenValue isInvert noRenderPrice noRenderSymbol value={allowance.amount()} prefix='+' /></div>
                  <div styleName='balanceFiat'><TokenValue isInvert renderOnlyPrice value={allowance.amount()} /></div>
                </div>
              )}
            </div>

            {this.state.step !== WITHDRAW && balance.gt(0) && (
              <div styleName='stepsWrapper'>
                <div styleName={classnames('step', { 'active': this.state.step === DEPOSIT_FIRST })}>
                  <Translate value={prefix('firstStep')} />
                </div>
                <div styleName={classnames('step', { 'active': this.state.step === DEPOSIT_SECOND })}>
                  <Translate value={prefix('secondStep')} />
                </div>
              </div>
            )}
          </div>
        ) : <div styleName='preloader'><Preloader /></div>}
      </div>
    )
  }

  renderBody () {
    const { balance, balanceEth, amount, token, feeMultiplier } = this.props
    return (
      <div>
        {this.state.step === DEPOSIT_SECOND && (
          <div styleName='noteTwo'>
            <Translate value={prefix('noteTwo')} />
          </div>)}
        <div styleName={classnames('fieldWrapper', { 'fieldWrapperHide': this.state.step === DEPOSIT_SECOND })}>
          <Field
            component={TextField}
            fullWidth
            hintText='0.00'
            floatingLabelText={<Translate value={prefix('amount')} symbol='TIME' />}
            name='amount'
          />
          <div styleName='amountInFiat'><TokenValue renderOnlyPrice value={new Amount(token.addDecimals(amount), token.symbol())} /></div>
        </div>
        {(
          <div>
            <div styleName='feeRate'>
              <div styleName='tagsWrap'>
                <div><Translate value={prefix('slow')} /></div>
                <div styleName='tagDefault' />
                <div><Translate value={prefix('fast')} /></div>
              </div>

              <Field
                component={Slider}
                sliderStyle={{ marginBottom: 0, marginTop: 5 }}
                name='feeMultiplier'
                {...FEE_RATE_MULTIPLIER}
              />
            </div>
          </div>
        )}
        <div styleName='transactionsInfo'>
          <div>
            <div><b><Translate value={prefix('transactionFee')} />: </b> <span styleName='infoText'>{this.state.gasFee && <TokenValue value={this.state.gasFee} />}</span></div>
            <div>
              <b><Translate value={prefix('gasPrice')} />: </b>
              {this.state.gasPrice && `${web3Converter.fromWei(this.state.gasPrice, 'gwei').toString()} Gwei`}
              {this.state.gasPrice && <Translate value={prefix('multiplier')} multiplier={feeMultiplier} />}
            </div>
            <div>{!amount || amount <= 0 ? <Translate value={prefix('enterAmount')} /> : null}</div>
          </div>
        </div>
        {this.state.step === DEPOSIT_FIRST && (
          <div styleName='note'>
            <b><Translate value={prefix('note')} />&nbsp;</b>
            <Translate value={prefix('noteText')} />
          </div>)}
        <div styleName='notesWrapper'>
          {balanceEth && balanceEth.lte(0) && (
            <div styleName='note'>
              <div styleName='icon'>
                <i className='chronobank-icon'>warning</i>
              </div>
              <Translate value={prefix('noteEth')} />
            </div>
          )}
          {balance && balance.lte(0) && (
            <div styleName='note'>
              <div styleName='icon'>
                <i className='chronobank-icon'>warning</i>
              </div>
              <Translate value={prefix('noteBalance')} />
            </div>
          )}
        </div>
      </div>
    )
  }

  renderFoot () {
    const {
      isShowTIMERequired,
      balanceEth,
      amount,
      balance,
      deposit,
      token,
      allowance,
      pristine,
      invalid,
      handleSubmit,
      wallet,
    } = this.props

    const isInvalid = pristine || invalid
    const amountWithDecimals = isInvalid
      ? new BigNumber(0)
      : token.addDecimals(amount || 0)

    const isRevokeDisabled = allowance.isFetching() || !allowance.isFetched() || !balanceEth || balanceEth.lte(0)
    const isApproveDisabled = isInvalid || balance.lt(amountWithDecimals) || allowance.isFetching() || !allowance.isFetched() || !balanceEth || balanceEth.lte(0)
    const isLockDisabled = isInvalid || !this.getIsLockValid(amountWithDecimals) || allowance.isFetching() || !allowance.isFetched() || !balanceEth || balanceEth.lte(0)
    const isWithdrawDisabled = isInvalid || deposit.lt(amountWithDecimals) || !balanceEth || balanceEth.lte(0)

    return (
      <div styleName='actions'>
        {balanceEth && balanceEth.lte(0) && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('receiveEth')} />}
              onClick={this.handleReceiveToken(ETH, wallet)}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_FIRST && isShowTIMERequired && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('buyTime')} />}
              onClick={this.handleReceiveToken(token.id(), wallet)}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_FIRST && isShowTIMERequired && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('requestTime')} />}
              onClick={this.handleRequireTime}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_FIRST && !isShowTIMERequired && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('proceed')} />}
              onClick={handleSubmit(this.handleApproveAsset)}
              disabled={isApproveDisabled}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_SECOND && (
          <div styleName='action'>
            <Button
              flat
              styleName='actionButton'
              label={<Translate value={prefix('revoke')} />}
              onClick={handleSubmit(this.handleRevokeAsset)}
              disabled={isRevokeDisabled}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_SECOND && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('finish')} />}
              onClick={handleSubmit(this.handleDepositAsset)}
              disabled={isLockDisabled}
            />
          </div>
        )}
        {this.state.step === WITHDRAW && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('withdraw')} />}
              onClick={handleSubmit(this.handleWithdrawAsset)}
              disabled={isWithdrawDisabled}
            />
          </div>
        )}
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <form onSubmit={this.props.handleSubmit}>
          {this.renderHead()}
          <div styleName='body'>
            {this.renderBody()}
            {this.renderFoot()}
          </div>
        </form>
      </div>
    )
  }
}
