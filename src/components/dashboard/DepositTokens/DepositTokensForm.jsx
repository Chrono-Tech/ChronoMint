/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button, IPFSImage } from 'components'
import { Slider, TextField } from 'redux-form-material-ui'
import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import web3Converter from 'utils/Web3Converter'
import { TOKEN_ICONS } from 'assets'
import { modalsOpen } from 'redux/modals/actions'
import BigNumber from 'bignumber.js'
import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Amount from 'models/Amount'
import AssetsCollection from 'models/assetHolder/AssetsCollection'
import TokenModel from 'models/tokens/TokenModel'
import TokensCollection from 'models/tokens/TokensCollection'
import MainWalletModel from 'models/wallet/MainWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_ASSETS_HOLDER } from 'redux/assetsHolder/actions'
import { DUCK_MAIN_WALLET, estimateGasForDeposit, ETH, mainApprove, mainRevoke, requireTIME } from 'redux/mainWallet/actions'
import { TX_DEPOSIT, TX_WITHDRAW_SHARES } from 'dao/AssetHolderDAO'
import { TX_APPROVE } from 'dao/ERC20DAO'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import AllowanceModel from 'models/wallet/AllowanceModel'
import classnames from 'classnames'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { getGasPriceMultiplier } from 'redux/session/selectors'
import './DepositTokensForm.scss'
import validate from './validate'
import ReceiveTokenModal from '../ReceiveTokenModal/ReceiveTokenModal'

export const FORM_DEPOSIT_TOKENS = 'FormDepositTokens'

export const ACTION_APPROVE = 'deposit/approve'
export const ACTION_DEPOSIT = 'deposit/deposit'
export const ACTION_WITHDRAW = 'deposit/withdraw'

const DEPOSIT_FIRST = 'depositFirst'
const DEPOSIT_SECOND = 'depositSecond'
const WITHDRAW = 'withdraw'

const FEE_RATE_MULTIPLIER = {
  min: 0.1,
  max: 1.9,
  step: 0.1,
}

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
  const wallet: MainWalletModel = state.get(DUCK_MAIN_WALLET)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const tokens = state.get(DUCK_TOKENS)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  const token = tokens.item(tokenId)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const balance = wallet.balances().item(tokenId).amount()
  const balanceEth = wallet.balances().item(ETH).amount()

  const assets = assetHolder.assets()
  const spender = assetHolder.wallet()

  return {
    balance,
    balanceEth,
    deposit: assets.item(token.address()).deposit(),
    allowance: wallet.allowances().item(spender, token.id()),
    spender,
    amount: Number.parseFloat(amount) || 0,
    token,
    feeMultiplier,
    tokens,
    assets,
    isShowTIMERequired: isTesting && !wallet.isTIMERequired() && balance.isZero() && token.symbol() === 'TIME',
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
    requireTIME: () => dispatch(requireTIME()),
    receiveToken: (tokenId, blockchain) => dispatch(modalsOpen({ component: ReceiveTokenModal, props: { tokenId, blockchain } })),
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
    wallet: PropTypes.instanceOf(MainWalletModel),
    tokens: PropTypes.instanceOf(TokensCollection),
    selectedToken: PropTypes.string,
    assets: PropTypes.instanceOf(AssetsCollection),
    requireTIME: PropTypes.func,
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
    if (this.props.allowance.amount().gt(0)) {
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
      estimateGasForDeposit(
        action,
        [action, [spender, new BigNumber(amount)]],
        (error, { gasFee, gasPrice }) => {
          if (!error) {
            this.setState({ gasFee, gasPrice })
          } else {
            // eslint-disable-next-line
            console.log(error)
          }
        },
        feeMultiplier,
      )
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

  handleReceiveToken = (tokenId, blockchain) => () => {
    this.props.onCloseModal()
    this.props.receiveToken(tokenId, blockchain)
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
          {balanceEth.lte(0) && (
            <div styleName='note'>
              <div styleName='icon'>
                <i className='chronobank-icon'>warning</i>
              </div>
              <Translate value={prefix('noteEth')} />
            </div>
          )}
          {balance.lte(0) && (
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
    const { isShowTIMERequired, balanceEth, amount, balance, deposit, token, allowance, pristine, invalid, handleSubmit } = this.props
    const isInvalid = pristine || invalid
    const amountWithDecimals = isInvalid
      ? new BigNumber(0)
      : token.addDecimals(amount || 0)

    const isRevokeDisabled = allowance.isFetching() || !allowance.isFetched() || balanceEth.lte(0)
    const isApproveDisabled = isInvalid || balance.lt(amountWithDecimals) || allowance.isFetching() || !allowance.isFetched() || balanceEth.lte(0)
    const isLockDisabled = isInvalid || !this.getIsLockValid(amountWithDecimals) || allowance.isFetching() || !allowance.isFetched() || balanceEth.lte(0)
    const isWithdrawDisabled = isInvalid || deposit.lt(amountWithDecimals) || balanceEth.lte(0)

    return (
      <div styleName='actions'>
        {balanceEth.lte(0) && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('receiveEth')} />}
              onTouchTap={this.handleReceiveToken(ETH, BLOCKCHAIN_ETHEREUM)}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_FIRST && isShowTIMERequired && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('buyTime')} />}
              onTouchTap={this.handleReceiveToken(token.id(), token.blockchain())}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_FIRST && isShowTIMERequired && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('requestTime')} />}
              onTouchTap={this.handleRequireTime}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_FIRST && !isShowTIMERequired && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('proceed')} />}
              onTouchTap={handleSubmit(this.handleApproveAsset)}
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
              onTouchTap={handleSubmit(this.handleRevokeAsset)}
              disabled={isRevokeDisabled}
            />
          </div>
        )}
        {this.state.step === DEPOSIT_SECOND && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('finish')} />}
              onTouchTap={handleSubmit(this.handleDepositAsset)}
              disabled={isLockDisabled}
            />
          </div>
        )}
        {this.state.step === WITHDRAW && (
          <div styleName='action'>
            <Button
              styleName='actionButton'
              label={<Translate value={prefix('withdraw')} />}
              onTouchTap={handleSubmit(this.handleWithdrawAsset)}
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
