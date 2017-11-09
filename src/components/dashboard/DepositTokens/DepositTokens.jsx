import BigNumber from 'bignumber.js'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'
import { isTestingNetwork } from 'Login/network/settings'
import { DUCK_NETWORK } from 'Login/redux/network/actions'
import { FlatButton, Paper, RaisedButton, TextField } from 'material-ui'
import type TokenModel from 'models/TokenModel'
import type MainWallet from 'models/Wallet/MainWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { depositTIME, DUCK_MAIN_WALLET, initTIMEDeposit, mainApprove, requireTIME, TIME, updateIsTIMERequired, withdrawTIME } from 'redux/mainWallet/actions'
import ColoredSection from '../ColoredSection/ColoredSection'
import IconSection from '../IconSection/IconSection'
import './DepositTokens.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const TIME_ICON = require('assets/img/icn-time.svg')

const DEPOSIT_LIMIT = 1

function prefix (token) {
  return `components.dashboard.DepositTokens.${token}`
}

function mapStateToProps (state) {
  const wallet: MainWallet = state.get(DUCK_MAIN_WALLET)
  const token: TokenModel = wallet.tokens().get(TIME)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)

  return {
    token,
    deposit: wallet.timeDeposit(),
    isShowTIMERequired: isTesting && !wallet.isTIMERequired() && token && token.balance().eq(0),
    timeAddress: wallet.timeAddress(),
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

export class DepositTokens extends PureComponent {
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

  handleAmountChange (amount) {
    this.setState({
      amount,
      errors: this.validators.amount(amount),
    })
  }

  handleApproveTIME = () => {
    this.props.mainApprove(this.props.token, this.state.amount, this.props.timeAddress)
    if (Number(this.state.amount) === 0) {
      this.setState({ amount: '' })
    }
  }

  handleDepositTIME = () => {
    this.props.depositTIME(this.state.amount)
    this.setState({ amount: '' })
  }

  handleWithdrawTIME = () => {
    this.props.withdrawTIME(this.state.amount)
    this.setState({ amount: '' })
  }

  renderHead () {
    const token: TokenModel = this.props.token
    const { deposit } = this.props
    const symbol = token.symbol()

    return (
      <div>
        <IconSection title={<Translate value={prefix('depositTime')} />} icon={TIME_ICON}>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('yourSymbolBalance')} symbol={symbol} />:</div>
            <TokenValue
              isInvert
              value={token.balance()}
              symbol={symbol}
            />
          </div>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('yourSymbolDeposit')} symbol={symbol} />:</div>
            <TokenValue
              isInvert
              isLoading={deposit === null}
              value={deposit || new BigNumber(0)}
              symbol={symbol}
            />
          </div>
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('symbolHolderAllowance')} symbol={symbol} />:</div>
            <TokenValue
              isInvert
              value={token.allowance(this.props.timeAddress)}
              symbol={symbol}
            />
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
            onChange={(event, value) => this.handleAmountChange(value)}
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

  render () {
    return (
      <Paper>
        {this.props.token ? (
          <ColoredSection
            styleName='root'
            head={this.renderHead()}
            body={this.renderBody()}
            foot={this.renderFoot()}
          />
        ) : null}
      </Paper>
    )
  }

  getIsLockValid () {
    const { token, isTesting, timeAddress, deposit } = this.props
    const limit = isTesting
      ? BigNumber.min(
        token.balance(),
        token.allowance(timeAddress)
      )
      : BigNumber.min(
        DEPOSIT_LIMIT,
        token.balance(),
        BigNumber.max(new BigNumber(DEPOSIT_LIMIT).minus(deposit), 0),
        token.allowance(timeAddress)
      )

    return limit.gte(this.state.amount)
  }

  renderFoot () {
    const { amount } = this.state
    const token: TokenModel = this.props.token
    const { isShowTIMERequired, deposit, errors } = this.props
    const isValid = !errors && String(amount).length > 0 && +amount > 0

    const isApprove = isValid && token.balance().gte(amount)
    const isLock = isValid && this.getIsLockValid()
    const isWithdraw = isValid && +amount <= deposit
    return (
      <div styleName='actions'>
        {isShowTIMERequired ? (
          <span styleName='action'>
            <FlatButton
              styleName='actionButton'
              label={<Translate value={prefix('requireTime')} />}
              onTouchTap={() => this.props.requireTIME()}
            />
          </span>
        ) : (
          <span styleName='action'>
            <RaisedButton
              styleName='actionButton'
              label='Approve'
              onTouchTap={this.handleApproveTIME}
              disabled={!isApprove}
            />
          </span>
        )}
        {
          !isShowTIMERequired
            ? (
              <span styleName='action'>
                <RaisedButton
                  styleName='actionButton'
                  label='Lock'
                  primary
                  onTouchTap={this.handleDepositTIME}
                  disabled={!isLock}
                />
              </span>
            ) : null
        }
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
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositTokens)
