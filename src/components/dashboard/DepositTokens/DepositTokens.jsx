import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import IconTimeSVG from 'assets/img/icn-time.svg'
import BigNumber from 'bignumber.js'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { FlatButton, Paper, RaisedButton, TextField } from 'material-ui'
import Amount from 'models/Amount'
import validator from 'models/validator'
import MainWallet from 'models/wallet/MainWalletModel'
import ErrorList from 'platform/ErrorList'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { depositAsset, DUCK_ASSETS_HOLDER, initTimeHolder, withdrawAsset } from 'redux/assetsHolder/actions'
import { DUCK_MAIN_WALLET, mainApprove, requireTIME, updateIsTIMERequired } from 'redux/mainWallet/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import ColoredSection from '../ColoredSection/ColoredSection'
import IconSection from '../IconSection/IconSection'
import './DepositTokens.scss'

const DEPOSIT_LIMIT = 1

function prefix (token) {
  return `components.dashboard.DepositTokens.${token}`
}

function mapStateToProps (state) {
  const wallet: MainWallet = state.get(DUCK_MAIN_WALLET)
  const timeAddress = state.get(DUCK_ASSETS_HOLDER).timeAddress()
  const token = state.get(DUCK_TOKENS).item(timeAddress)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const allowance = token ? token.allowance(timeAddress) : new BigNumber(0)
  const balance = wallet.balances().item(token.id())

  return {
    token,
    balance: balance ? balance.amount() : new Amount(),
    deposit: wallet.timeDeposit(),
    isShowTIMERequired: isTesting && !wallet.isTIMERequired() && token && token.balance().eq(0),
    timeAddress,
    allowance,
    isTesting,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initTimeHolder: () => dispatch(initTimeHolder()),
    updateRequireTIME: () => dispatch(updateIsTIMERequired()),
    mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender)),
    depositAsset: (amount, token) => dispatch(depositAsset(amount, token)),
    withdrawAsset: (amount) => dispatch(withdrawAsset(amount)),
    requireTIME: () => dispatch(requireTIME()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositTokens extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    allowance: PropTypes.instanceOf(Amount),
    balance: PropTypes.instanceOf(Amount),
    initTimeHolder: PropTypes.func,
    mainApprove: PropTypes.func,
    depositAsset: PropTypes.func,
    withdrawAsset: PropTypes.func,
    requireTIME: PropTypes.func,
    isShowTIMERequired: PropTypes.bool,
    isTesting: PropTypes.bool,
    updateRequireTIME: PropTypes.func,
    token: PropTypes.object,
    errors: PropTypes.object,
    timeAddress: PropTypes.string,
    wallet: PropTypes.instanceOf(MainWallet),
  }

  constructor (props) {
    super(props)
    this.state = {
      amount: '',
      errors: null,
    }
    this.validators = {
      amount: (amount) =>
        // TODO @bshevchenko: add decimals length validator, see SendTokens
        new ErrorList()
          .add(validator.required(amount))
          .add(validator.positiveNumberOrZero(amount))
          .getErrors(),
    }
  }

  componentWillMount () {
    this.props.initTimeHolder()
    this.props.updateRequireTIME()
  }

  handleAmountChange = (event, amount) => {
    this.setState({
      amount,
      errors: this.validators.amount(amount),
    })
  }

  handleApproveTIME = () => {
    this.props.mainApprove(this.props.token, +this.state.amount, this.props.timeAddress)
    if (Number(this.state.amount) === 0) {
      this.setState({ amount: '' })
    }
  }

  handleRevokeTIME = () => {
    this.props.mainApprove(this.props.token, 0, this.props.timeAddress)
  }

  handleDepositAsset = () => {
    const { token } = this.props
    this.props.depositAsset(new Amount(this.state.amount, token.symbol(), token))
    this.setState({ amount: '' })
  }

  handleWithdrawAsset = () => {
    const { token } = this.props
    this.props.withdrawAsset(new Amount(this.state.amount, token.symbol()), token)
    this.setState({ amount: '' })
  }

  handleRequireTime = () => this.props.requireTIME()

  getIsLockValid () {
    const { token, isTesting, allowance, deposit } = this.props
    const limit = isTesting
      ? BigNumber.min(
        token.balance(),
        allowance,
      )
      : BigNumber.min(
        DEPOSIT_LIMIT,
        token.balance(),
        BigNumber.max(new BigNumber(DEPOSIT_LIMIT).minus(deposit), 0),
        allowance,
      )
    return limit.gte(this.state.amount)
  }

  renderHead () {
    const { deposit, allowance, token, balance } = this.props
    const symbol = token.symbol()

    return (
      <div>
        <IconSection title={<Translate value={prefix('depositTime')} />} icon={IconTimeSVG}>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('yourSymbolBalance')} symbol={symbol} />:</div>
            <TokenValue isInvert value={balance} />
          </div>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('yourSymbolDeposit')} symbol={symbol} />:</div>
            <TokenValue isInvert value={deposit} />
          </div>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('symbolHolderAllowance')} symbol={symbol} />:</div>
            <TokenValue isInvert value={allowance} />
          </div>
        </IconSection>
      </div>
    )
  }

  renderBody () {
    return (
      <div styleName='form'>
        <div>
          <TextField
            onChange={this.handleAmountChange}
            hintText='0.00'
            floatingLabelText={<Translate value={prefix('amount')} />}
            value={this.state.amount}
            style={{ width: '150px' }}
            errorText={this.state.errors}
          />
          {!this.props.isTesting && <div styleName='warning'><Translate value='errors.limitDepositOnMainnet' /></div>}
        </div>
      </div>
    )
  }

  renderFoot () {
    const { amount } = this.state
    const { isShowTIMERequired, deposit, errors, token, allowance } = this.props
    const isValid = !errors && String(amount).length > 0 && +amount > 0

    const isApprove = isValid && token.balance().gte(amount)
    const isLock = isValid && this.getIsLockValid()
    const isWithdraw = isValid && +amount <= deposit
    const isRevoke = !allowance.isZero()
    return (
      <div styleName='actions'>
        {isShowTIMERequired
          ? (
            <span styleName='action'>
              <FlatButton
                styleName='actionButton'
                label={<Translate value={prefix('requireTime')} />}
                onTouchTap={this.handleRequireTime}
              />
            </span>
          ) : (
            <span styleName='action'>
              <RaisedButton
                styleName='actionButton'
                label={isRevoke ? 'Revoke' : 'Approve'}
                onTouchTap={isRevoke ? this.handleRevokeTIME : this.handleApproveTIME}
                disabled={!isRevoke && !isApprove}
              />
            </span>
          )
        }
        {!isShowTIMERequired && (
          <span styleName='action'>
            <RaisedButton
              styleName='actionButton'
              label='Lock'
              primary
              onTouchTap={this.handleDepositAsset}
              disabled={!isLock}
            />
          </span>
        )}
        <span styleName='action'>
          <RaisedButton
            styleName='actionButton'
            label={<Translate value={prefix('withdraw')} />}
            primary
            onTouchTap={this.handleWithdrawAsset}
            disabled={!isWithdraw}
          />
        </span>
      </div>
    )
  }

  render () {
    return (
      <Paper>
        <ColoredSection
          styleName='root'
          head={this.renderHead()}
          body={this.renderBody()}
          foot={this.renderFoot()}
        />
      </Paper>
    )
  }
}
