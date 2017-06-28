import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TextField, RaisedButton, FlatButton } from 'material-ui'

import { depositTIME, withdrawTIME } from 'redux/wallet/actions'

import IconSection from '../IconSection'
import ColoredSection from '../ColoredSection'

import './DepositTokens.scss'
import TokenValue from '../TokenValue/TokenValue'
import { requireTIME, updateTIMEDeposit } from '../../../redux/wallet/actions'
import { isTestingNetwork } from '../../../network/settings'

export class DepositTokens extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    symbol: PropTypes.string,
    balance: PropTypes.number,
    deposit: PropTypes.number,
    isBalanceFetching: PropTypes.bool,
    isTimeDepositFetching: PropTypes.bool,
    updateTIMEDeposit: PropTypes.func,
    depositTIME: PropTypes.func,
    withdrawTIME: PropTypes.func,
    requireTIME: PropTypes.func,
    isTesting: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      amount: ''
    }
  }

  componentWillMount () {
    this.props.updateTIMEDeposit()
  }

  render () {
    return (
      <ColoredSection
        styleName='root'
        head={this.renderHead()}
        body={this.renderBody()}
        foot={this.renderFoot()} />
    )
  }

  renderHead () {
    const {symbol, balance, deposit, isBalanceFetching, isTimeDepositFetching} = this.props

    return (
      <div>
        <IconSection title={this.props.title}>
          <div styleName='balance'>
            <div styleName='label'>Your {symbol} deposit:</div>
            <TokenValue
              isLoading={isBalanceFetching}
              value={balance}
              symbol={symbol}
            />
          </div>
          <div styleName='balance'>
            <div styleName='label'>Total {symbol} deposit:</div>
            <TokenValue
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
            floatingLabelText='Amount'
            type='number'
            min='0'
            max={this.props.balance || 0}
            value={this.state.amount}
            style={{width: '150px'}}
          />
        </div>
      </div>
    )
  }

  renderFoot () {
    const isValid = +this.state.amount > 0 && !this.props.isBalanceFetching && !this.props.isTimeDepositFetching
    const isWithdraw = isValid && +this.state.amount <= this.props.deposit
    return (
      <div styleName='actions'>
        {(this.props.isTesting && this.props.balance === 0) && (
          <span styleName='action'>
          <FlatButton
            label='Require time'
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
    this.setState({amount: Math.max(+amount, 0)})
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
  const {tokens, timeDeposit, isTimeDepositFetching} = state.get('wallet')
  const timeToken = tokens.get('TIME')
  const {selectedNetworkId, selectedProviderId} = state.get('network')

  return {
    symbol: timeToken.symbol(),
    balance: timeToken.balance(),
    isBalanceFetching: timeToken.isFetching(),
    deposit: timeDeposit,
    isTimeDepositFetching,
    isTesting: isTestingNetwork(selectedNetworkId, selectedProviderId)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateTIMEDeposit: () => dispatch(updateTIMEDeposit()),
    depositTIME: (amount) => dispatch(depositTIME(amount)),
    withdrawTIME: (amount) => dispatch(withdrawTIME(amount)),
    requireTIME: () => dispatch(requireTIME())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositTokens)
