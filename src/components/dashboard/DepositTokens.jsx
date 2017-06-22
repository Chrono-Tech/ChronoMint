import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TextField, RaisedButton, FlatButton } from 'material-ui'

import { depositTIME, withdrawTIME } from 'redux/wallet/actions'

import IconSection from './IconSection'
import ColoredSection from './ColoredSection'

import './DepositTokens.scss'

export class DepositTokens extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    account: PropTypes.string,
    amount: PropTypes.string,
    deposit: PropTypes.string,
    balance: PropTypes.string,
    isFetching: PropTypes.bool,
    handleDepositTIME: PropTypes.func,
    handleWithdrawTIME: PropTypes.func
  }

  static defaultProps = {
    amount: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      amount: props.amount
    }
  }

  render() {
    return (
      <ColoredSection styleName="root"
        head={this.renderHead()}
        body={this.renderBody()}
        foot={this.renderFoot()} />
    )
  }

  renderHead() {

    // Sometimes we use strings to store balance and transaction volume, Sometimes we are not
    const [ balance1, balance2 ] = ('' + this.props.balance).split('.')
    const [ deposit1, deposit2 ] = ('' + this.props.deposit).split('.')

    return (
      <div>
        <IconSection title={this.props.title}>
          <div styleName="balance">
            <div styleName="label">Your time deposit:</div>
            <div styleName="value">
              <span styleName="value1">{deposit1}</span>
              {!balance2 ? null : (
                <span styleName="value2">.{deposit2}</span>
              )}
              <span styleName="value3">&nbsp;TIME</span>
            </div>
          </div>
          <div styleName="balance">
            <div styleName="label">Total time balance:</div>
            <div styleName="value">
              <span styleName="value1">{balance1}</span>
              {!balance2 ? null : (
                <span styleName="value2">.{balance2}</span>
              )}
              <span styleName="value3">&nbsp;TIME</span>
            </div>
          </div>
        </IconSection>
      </div>
    )
  }

  renderBody() {
    return (
      <div styleName="form">
        <div>
          <TextField onChange={(event, value) => this.handleAmountChange(value)}
            floatingLabelText="Amount"
            value={this.state.amount}
            style={{width: '150px'}}
          />
        </div>
      </div>
    )
  }

  renderFoot() {
    return (
      <div styleName="actions">
        <span styleName="action">
          <FlatButton label="Require time"/>
        </span>
        <span styleName="action">
          <RaisedButton label="Lock" onTouchTap={() => this.props.handleDepositTIME(this.state.amount)}/>
        </span>
        <span styleName="action">
          <RaisedButton label="Withdraw" primary/>
        </span>
      </div>
    )
  }

  handleAmountChange(amount) {
    this.setState({
      amount
    })
  }
}

export const TIME = 'TIME'

function mapStateToProps (state) {
  let session = state.get('session')
  let wallet = state.get('wallet')
  let time = wallet.tokens.get(TIME)

  return {
    account: session.account,
    balance: time.balance(),
    deposit: wallet.timeDeposit,
    isFetching: time.isFetching()
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDepositTIME: (amount) => dispatch(depositTIME(amount)),
    handleWithdrawTIME: (amount) => dispatch(withdrawTIME(amount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositTokens)
