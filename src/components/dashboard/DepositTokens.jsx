import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TextField, RaisedButton, FlatButton } from 'material-ui'

import { depositTIME } from '../../../src/redux/wallet/actions'

import IconSection from './IconSection'
import ColoredSection from './ColoredSection'

import './DepositTokens.scss'

export class DepositTokens extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    account: PropTypes.string,
    amount: PropTypes.number,
    handleDepositTIME: PropTypes.func
  }

  static defaultProps = {
    amount: 10
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
    return (
      <div>
        <IconSection title={this.props.title}>
          <div styleName="balance">
            <div styleName="label">Your time deposit:</div>
            <div styleName="value">
              <span styleName="value1">1 512 000</span>
              <span styleName="value2">.00123 TIME</span>
            </div>
          </div>
          <div styleName="balance">
            <div styleName="label">Total time deposit:</div>
            <div styleName="value">
              <span styleName="value1">1 512 000</span>
              <span styleName="value2">.00123 TIME</span>
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
    this.setState(
      ...this.state,
      amount
    )
  }
}

function mapStateToProps (state) {
  let session = state.get('session')
  let wallet = state.get('wallet')

  return {
    isTokensLoaded: !wallet.tokensFetching,
    tokens: wallet.tokens,
    account: session.account
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDepositTIME: (amount) => dispatch(depositTIME(amount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositTokens)
