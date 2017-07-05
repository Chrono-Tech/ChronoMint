import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TextField, RaisedButton, FlatButton } from 'material-ui'
import { depositTIME, withdrawTIME } from 'redux/wallet/actions'
import IconSection from '../IconSection'
import ColoredSection from '../ColoredSection'
import TokenValue from '../TokenValue/TokenValue'
import { requireTIME, updateIsTIMERequired, updateTIMEDeposit } from '../../../redux/wallet/actions'
import { isTestingNetwork } from '../../../network/settings'
import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'
import './DepositTokens.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const TIME_ICON = require('assets/img/icn-time.svg')

export class DepositTokens extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    deposit: PropTypes.number,
    isTimeDepositFetching: PropTypes.bool,
    updateTIMEDeposit: PropTypes.func,
    depositTIME: PropTypes.func,
    withdrawTIME: PropTypes.func,
    requireTIME: PropTypes.func,
    isShowTimeRequired: PropTypes.bool,
    updateRequireTIME: PropTypes.func,
    token: PropTypes.object,
    errors: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      amount: '',
      errors: null
    }
    this.validators = {
      amount: (amount) => {
        return new ErrorList()
          .add(validator.required(amount))
          .add(validator.positiveNumber(amount))
          .getErrors()
      }
    }
  }

  componentWillMount () {
    this.props.updateTIMEDeposit()
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
    const {token, isTimeDepositFetching, deposit} = this.props
    const symbol = token.symbol()

    return (
      <div>
        <IconSection title={this.props.title} icon={TIME_ICON}>
          <div styleName='balance'>
            <div styleName='label'>Your {symbol} balance:</div>
            <TokenValue
              isInvert
              isLoading={token.isFetching()}
              value={token.balance()}
              symbol={symbol}
            />
          </div>
          <div styleName='balance'>
            <div styleName='label'>Your {symbol} deposit:</div>
            <TokenValue
              isInvert
              isLoading={isTimeDepositFetching}
              value={deposit}
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
            floatingLabelText='Amount'
            value={this.state.amount}
            style={{width: '150px'}}
            errorText={this.state.errors}
          />
        </div>
      </div>
    )
  }

  renderFoot () {
    const {amount} = this.state
    const {token, isShowTimeRequired, isTimeDepositFetching, deposit, errors} = this.props
    const isValid = !errors && +amount > 0 && +amount <= token.balance() && !token.isFetching() && !isTimeDepositFetching
    const isWithdraw = isValid && +amount <= deposit
    return (
      <div styleName='actions'>
        {isShowTimeRequired && (
          <span styleName='action'>
          <FlatButton
            label='Require TIME'
            onTouchTap={() => this.props.requireTIME()}
          />
        </span>
        )}
        <span styleName='action'>
          <RaisedButton
            label='Lock'
            onTouchTap={this.handleDepositTIME}
            disabled={!isValid}
          />
        </span>
        <span styleName='action'>
          <RaisedButton
            label='Withdraw'
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

  handleDepositTIME = () => {
    this.props.depositTIME(this.state.amount, this.props.token)
    this.setState({amount: ''})
  }

  handleWithdrawTIME = () => {
    this.props.withdrawTIME(this.state.amount, this.props.token)
    this.setState({amount: ''})
  }
}

function mapStateToProps (state) {
  const {tokens, timeDeposit, isTimeDepositFetching, isTimeRequired} = state.get('wallet')
  const token = tokens.get('TIME')
  const {selectedNetworkId, selectedProviderId} = state.get('network')
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)

  return {
    token,
    deposit: timeDeposit,
    isTimeDepositFetching,
    isShowTimeRequired: isTesting && !isTimeRequired && token && token.balance() === 0
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateTIMEDeposit: () => dispatch(updateTIMEDeposit()),
    updateRequireTIME: () => dispatch(updateIsTIMERequired()),
    depositTIME: (amount, token) => dispatch(depositTIME(amount, token)),
    withdrawTIME: (amount, token) => dispatch(withdrawTIME(amount, token)),
    requireTIME: (token) => dispatch(requireTIME(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositTokens)
