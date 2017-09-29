import React from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import { connect } from 'react-redux'
import { TextField, RaisedButton, FlatButton } from 'material-ui'
import type TokenModel from 'models/TokenModel'
import { depositTIME, withdrawTIME, approve, TIME } from 'redux/wallet/actions'
import IconSection from '../IconSection'
import ColoredSection from '../ColoredSection'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { requireTIME, updateIsTIMERequired, initTIMEDeposit } from 'redux/wallet/actions'
import { isTestingNetwork } from 'network/settings'
import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'
import './DepositTokens.scss'
import { Translate } from 'react-redux-i18n'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const TIME_ICON = require('assets/img/icn-time.svg')
const DEPOSIT_LIMIT = 1

function prefix (token) {
  return 'components.dashboard.DepositTokens.' + token
}

export class DepositTokens extends React.Component {

  static propTypes = {
    //title: PropTypes.string,
    title: PropTypes.object, // Translate object
    deposit: PropTypes.object,
    initTIMEDeposit: PropTypes.func,
    approve: PropTypes.func,
    depositTIME: PropTypes.func,
    withdrawTIME: PropTypes.func,
    requireTIME: PropTypes.func,
    isShowTIMERequired: PropTypes.bool,
    isTesting: PropTypes.bool,
    updateRequireTIME: PropTypes.func,
    token: PropTypes.object,
    errors: PropTypes.object,
    timeAddress: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      amount: '',
      errors: null
    }
    this.validators = {
      amount: (amount) => {
        // TODO @bshevchenko: add decimals length validator, see SendTokens
        return new ErrorList()
          .add(validator.required(amount))
          .add(validator.positiveNumberOrZero(amount))
          .getErrors()
      }
    }
  }

  componentWillMount () {
    this.props.initTIMEDeposit()
    this.props.updateRequireTIME()
  }

  render () {
    return this.props.token ? (
      <ColoredSection
        styleName='root'
        head={this.renderHead()}
        body={this.renderBody()}
        foot={this.renderFoot()} />
    ) : null
  }

  renderHead () {
    const token: TokenModel = this.props.token
    const {deposit} = this.props
    const symbol = token.symbol()

    return (
      <div>
        <IconSection title={this.props.title} icon={TIME_ICON}>
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
            style={{width: '150px'}}
            errorText={this.state.errors}
          />
          {!this.props.isTesting && <div styleName='warning'><Translate value='errors.limitDepositOnMainnet' /></div>}
        </div>
      </div>
    )
  }

  getIsLockValid () {
    const {token, isTesting, timeAddress, deposit} = this.props
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
    const {amount} = this.state
    const token: TokenModel = this.props.token
    const {isShowTIMERequired, deposit, errors} = this.props
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

  handleAmountChange (amount) {
    this.setState({
      amount,
      errors: this.validators.amount(amount)
    })
  }

  handleApproveTIME = () => {
    this.props.approve(this.props.token, this.state.amount, this.props.timeAddress)
    if (Number(this.state.amount) === 0) {
      this.setState({amount: ''})
    }
  }

  handleDepositTIME = () => {
    this.props.depositTIME(this.state.amount)
    this.setState({amount: ''})
  }

  handleWithdrawTIME = () => {
    this.props.withdrawTIME(this.state.amount)
    this.setState({amount: ''})
  }
}

function mapStateToProps (state) {
  const {tokens, timeDeposit, isTIMERequired, timeAddress} = state.get('wallet')
  const token: TokenModel = tokens.get(TIME)
  const {selectedNetworkId, selectedProviderId} = state.get('network')
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)

  return {
    token,
    deposit: timeDeposit,
    isShowTIMERequired: isTesting && !isTIMERequired && token && token.balance().eq(0),
    timeAddress,
    isTesting
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initTIMEDeposit: () => dispatch(initTIMEDeposit()),
    updateRequireTIME: () => dispatch(updateIsTIMERequired()),
    approve: (token, amount, spender) => dispatch(approve(token, amount, spender)),
    depositTIME: (amount) => dispatch(depositTIME(amount)),
    withdrawTIME: (amount) => dispatch(withdrawTIME(amount)),
    requireTIME: () => dispatch(requireTIME())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositTokens)
