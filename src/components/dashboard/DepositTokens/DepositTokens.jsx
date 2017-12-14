import Amount from 'models/Amount'
import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import IconTimeSVG from 'assets/img/icn-time.svg'
import BigNumber from 'bignumber.js'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { FlatButton, Paper, RaisedButton, TextField } from 'material-ui'
import BalanceModel from 'models/tokens/BalanceModel'
import TokenModel from 'models/tokens/TokenModel'
import validator from 'models/validator'
import MainWallet from 'models/wallet/MainWalletModel'
import ErrorList from 'platform/ErrorList'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { depositTIME, DUCK_MAIN_WALLET, initTIMEDeposit, mainApprove, requireTIME, updateIsTIMERequired, withdrawTIME } from 'redux/mainWallet/actions'
import { DUCK_TIME_HOLDER } from 'redux/timeHolder/actions'
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
  const timeAddress = state.get(DUCK_TIME_HOLDER).timeAddress()
  const token = state.get(DUCK_TOKENS).item(timeAddress) || new TokenModel()
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const allowance = token ? token.allowance(timeAddress) : new BigNumber(0)
  const balance = wallet.balances().item(token.id())

  console.log('--DepositTokens#mapStateToProps', balance)

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
    initTIMEDeposit: () => dispatch(initTIMEDeposit()),
    updateRequireTIME: () => dispatch(updateIsTIMERequired()),
    mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender)),
    depositTIME: (amount) => dispatch(depositTIME(amount)),
    withdrawTIME: (amount) => dispatch(withdrawTIME(amount)),
    requireTIME: () => dispatch(requireTIME()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositTokens extends PureComponent {
  static propTypes = {
    deposit: PropTypes.object,
    initTIMEDeposit: PropTypes.func,
    mainApprove: PropTypes.func,
    depositTIME: PropTypes.func,
    withdrawTIME: PropTypes.func,
    requireTIME: PropTypes.func,
    isShowTIMERequired: PropTypes.bool,
    isTesting: PropTypes.bool,
    updateRequireTIME: PropTypes.func,
    token: PropTypes.object,
    errors: PropTypes.object,
    timeAddress: PropTypes.string,
    allowance: PropTypes.instanceOf(BigNumber),
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
    this.props.initTIMEDeposit()
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

  handleDepositTIME = () => {
    this.props.depositTIME(this.state.amount)
    this.setState({ amount: '' })
  }

  handleWithdrawTIME = () => {
    this.props.withdrawTIME(this.state.amount)
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

    console.log('--DepositTokens#renderHead', balance)
    // TODO @dkchv: !!!!

    return (
      <div>
        <IconSection title={<Translate value={prefix('depositTime')} />} icon={IconTimeSVG}>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('yourSymbolBalance')} symbol={symbol} />:</div>
            {/*<TokenValue*/}
              {/*isInvert*/}
              {/*value={balance}*/}
            {/*/>*/}
          </div>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('yourSymbolDeposit')} symbol={symbol} />:</div>
            {/*<TokenValue*/}
              {/*isInvert*/}
              {/*isLoading={deposit === null}*/}
              {/*value={deposit || new BigNumber(0)}*/}
              {/*symbol={symbol}*/}
            {/*/>*/}
          </div>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('symbolHolderAllowance')} symbol={symbol} />:</div>
            {/*<TokenValue*/}
              {/*isInvert*/}
              {/*value={allowance}*/}
              {/*symbol={symbol}*/}
            {/*/>*/}
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
              onTouchTap={this.handleDepositTIME}
              disabled={!isLock}
            />
          </span>
        )}
        <span styleName='action'>
          <RaisedButton
            styleName='actionButton'
            label={<Translate value={prefix('withdraw')} />}
            primary
            onTouchTap={this.handleWithdrawTIME}
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
