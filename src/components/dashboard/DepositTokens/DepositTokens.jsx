import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TextField, RaisedButton, FlatButton } from 'material-ui'

// import { depositTIME } from 'redux/wallet/actions'
import { showDepositTIMEModal } from 'redux/ui/modal'

import IconSection from '../IconSection'
import ColoredSection from '../ColoredSection'

import './DepositTokens.scss'
import TokenValue from '../TokenValue/TokenValue'

export class DepositTokens extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    account: PropTypes.string,
    amount: PropTypes.number,
    handleDepositTIME: PropTypes.func,
    tokens: PropTypes.object
  }

  static defaultProps = {
    amount: 10
  }

  constructor (props) {
    super(props)

    // TODO @dkchv: update for all tokens
    // const firstToken = props.tokens.first()
    const timeToken = props.tokens.get('TIME')

    this.state = {
      amount: props.amount,
      token: timeToken
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
    const {token} = this.state
    return (
      <div>
        <IconSection title={this.props.title}>
          <div styleName='balance'>
            <div styleName='label'>Your time deposit:</div>
              <TokenValue
              styleName='value'
              value={token.balance()}
              symbol={token.symbol()}
            />
          </div>
          <div styleName='balance'>
            <div styleName='label'>Total time deposit:</div>
            <TokenValue
              value={token.balance()}
              symbol={token.symbol()}
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
    return (
      <div styleName='actions'>
        <span styleName='action'>
          <FlatButton label='Require time' />
        </span>
        <span styleName='action'>
          <RaisedButton label='Lock' onTouchTap={() => this.props.handleDepositTIME(this.state.amount)} />
        </span>
        <span styleName='action'>
          <RaisedButton label='Withdraw' primary />
        </span>
      </div>
    )
  }

  handleAmountChange (amount) {
    this.setState({amount})
  }
}

function mapStateToProps (state) {
  const {account} = state.get('session')
  const {tokens, tokensFetching} = state.get('wallet')

  return {
    isTokensLoaded: !tokensFetching,
    tokens,
    account
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDepositTIME: (amount) => dispatch(showDepositTIMEModal(amount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositTokens)
