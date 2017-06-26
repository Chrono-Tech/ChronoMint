import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TextField, RaisedButton, FlatButton } from 'material-ui'

import { depositTIME, withdrawTIME } from 'redux/wallet/actions'

import IconSection from '../IconSection'
import ColoredSection from '../ColoredSection'

import './DepositTokens.scss'
import TokenValue from '../TokenValue/TokenValue'

export class DepositTokens extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    handleDepositTIME: PropTypes.func,
    handleWithdrawTIME: PropTypes.func,
    symbol: PropTypes.string,
    balance: PropTypes.number,
    deposit: PropTypes.number,
    isFetching: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      amount: ''
    }
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
    const {symbol, balance, deposit, isFetching} = this.props

    return (
      <div>
        <IconSection title={this.props.title}>
          <div styleName='balance'>
            <div styleName='label'>Your {symbol} deposit:</div>
            <TokenValue
              isLoading={isFetching}
              value={balance}
              symbol={symbol}
            />
          </div>
          <div styleName='balance'>
            <div styleName='label'>Total {symbol} deposit:</div>
            <TokenValue
              isLoading={isFetching}
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
            value={this.state.amount}
            style={{width: '150px'}}
          />
        </div>
      </div>
    )
  }

  renderFoot () {
    const isValid = +this.state.amount > 0 && !this.props.isFetching
    const isWithdraw = isValid && +this.state.amount <= this.props.deposit
    // TODO @dkchv: requireTIME wait for SC update
    return (
      <div styleName='actions'>
        <span styleName='action'>
          <FlatButton
            label='Require time'
            disabled={true}
          />
        </span>
        <span styleName='action'>
          <RaisedButton
            label='Lock'
            onTouchTap={() => this.props.handleDepositTIME(this.state.amount)}
            disabled={!isValid}
          />
        </span>
        <span styleName='action'>
          <RaisedButton
            label='Withdraw'
            primary
            onTouchTap={() => this.props.handleWithdrawTIME(this.state.amount)}
            disabled={!isWithdraw}
          />
        </span>
      </div>
    )
  }

  handleAmountChange (amount) {
    this.setState({amount})
  }
}

function mapStateToProps (state) {
  const {tokens, timeDeposit} = state.get('wallet')
  const timeToken = tokens.get('TIME')

  return {
    symbol: timeToken.symbol(),
    balance: timeToken.balance(),
    isFetching: timeToken.isFetching(),
    deposit: timeDeposit
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDepositTIME: (amount) => dispatch(depositTIME(amount)),
    handleWithdrawTIME: (amount) => dispatch(withdrawTIME(amount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositTokens)
