import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { transfer } from 'redux/wallet/actions'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

import { MuiThemeProvider, SelectField, MenuItem, TextField, RaisedButton, Slider, Toggle } from 'material-ui'

import IconSection from './IconSection'
import ColoredSection from './ColoredSection'

import './SendTokens.scss'
import styles from './styles'
import inversedTheme from 'styles/themes/inversed.js'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  // LHUS: require('assets/img/icn-lhus.svg'),
  TIME: require('assets/img/icn-time.svg')
}

export class SendTokens extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    account: PropTypes.string,
    tokens: PropTypes.object,
    currency: PropTypes.string,
    recipient: PropTypes.string,
    amount: PropTypes.string,
    gasPrice: PropTypes.number,
    transfer: PropTypes.func,
    open: PropTypes.bool
  }

  static defaultProps = {
    gasPrice: 0.5,
    currency: 'ETH'
  }

  constructor(props) {
    super(props)

    this.validators = {
      recipient: (recipient) => {
        return new ErrorList()
          .add(validator.required(recipient))
          .add(recipient === this.state.sender ? 'errors.cantSentToYourself' : null)
          .getErrors()
      },
      amount: (amount) => {
        const format = validator.currencyNumber(amount, this.state.token.decimals())
        return new ErrorList()
          .add(validator.required(amount))
          .add({ value: format, decimals: this.state.token.decimals() })
          .getErrors()
      },
    }

    this.state = {
      token: {
        value: props.tokens.get(props.currency)
      },
      recipient: {
        value: props.recipient || '',
        errors: null
      },
      amount: {
        value: props.amount || '',
        errors: null
      },
      gasPrice: {
        value: props.gasPrice || ''
      },
      open: props.open
    }
  }

  validate() {

    let state = {
      recipient: {
        ...this.state.recipient,
        errors: this.validators.recipient(this.state.recipient.value)
      },
      amount: {
        ...this.state.amount,
        errors: this.validators.recipient(this.state.amount.value)
      },
    }

    this.setState({
      ...state,
      valid: !state.recipient.errors && !state.amount.errors
    })
  }

  componentDidMount() {

    // TODO @ipavlenko: Very sorry, there was no other way to change color
    // of the SelectField. Thre reason is the bug in the material-ui.
    // It is fixed in new version of the material-ui.
    // Please remove this hack after fix MINT-192.
    // And remove color from labelStyle of the SelectField.
    // And remove MuiThemeProvider with inversed theme.

    // eslint-disable-next-line
    for (const el of ReactDOM.findDOMNode(this.select).children) {
      el.style['-webkit-text-fill-color'] = null
    }
  }

  render() {
    return (
      <ColoredSection styleName="root"
        head={this.renderHead()}
        body={this.renderBody()}
        foot={this.renderFoot()}
      />
    )
  }

  renderHead() {

    const token = this.state.token.value
    const icon = token.icon() || ICON_OVERRIDES[token.name().toUpperCase()]
    const tokens = this.props.tokens.entrySeq().toArray()

    const [ balance1, balance2 ] = ('' + token.balance()).split('.')

    return (
      <div>
        <IconSection title={this.props.title} icon={icon}>
          <div styleName="form">
            <MuiThemeProvider theme={inversedTheme}>
              <SelectField
                className="SendTokens__select"
                ref={(select) => { this.select = select }}
                style={styles.widgets.sendTokens.currency.style}
                labelStyle={styles.widgets.sendTokens.currency.labelStyle}
                menuItemStyle={styles.widgets.sendTokens.currency.menuItemStyle}
                value={token.name()}
                onChange={(e, i, value) => this.handleChangeCurrency(value)}
              >
                { tokens.map(([name]) => (
                  <MenuItem key={name} value={name} primaryText={name.toUpperCase()} />
                )) }
              </SelectField>
            </MuiThemeProvider>
          </div>
        </IconSection>
        <div styleName="balance">
          <div styleName="label">Balance:</div>
          <div styleName="value">
            <span styleName="value1">{balance1}</span>
            {!balance2 ? null : (
              <span styleName="value2">.{balance2}</span>
            )}
            <span styleName="value3">&nbsp;{token.symbol()}</span>
          </div>
        </div>
      </div>
    )
  }

  renderBody() {
    return (
      <div styleName="form">
        <div>
          <TextField style={{width: '330px'}}
            onChange={(event, value) => this.handleRecipientChanged(value)}
            value={this.state.recipient.value}
            floatingLabelText="Recepient address"
            errorText={this.state.recipient.errors}
          />
        </div>
        <div>
          <TextField style={{width: '150px'}}
            onChange={(event, value) => this.handleAmountChanged(value)}
            value={this.state.amount.value}
            floatingLabelText="Amount"
            errorText={this.state.amount.errors}
          />
        </div>
        <div>
          <div styleName="gas">
            <div styleName="gas-label">
              Gas price:
            </div>
            <div styleName="gas-value">
              <Slider min={0} max={1} step={0.1}
                value={this.state.gasPrice.value}
                onChange={(event, value) => this.handleGasPriceChanged(value)}
              />
              <div styleName="axis">
                <div styleName="axis-label">Low</div>
                <div styleName="axis-label">Medium</div>
                <div styleName="axis-label">High</div>
              </div>
            </div>
            <div styleName="gas-actions">
              <span styleName="action-label">Advanced: </span>
              <span styleName="action-control">
                <Toggle toggled={this.state.open} onToggle={(event, value) => this.handleOpen(value)} />
              </span>
            </div>
          </div>
        </div>
        { !this.state.open ? null : (
          <div>
            <div>
              <TextField
                floatingLabelText="Gas limit"
                style={{width: '330px'}}
              />
            </div>
            <div>
              <TextField
                floatingLabelText="Custom data"
                style={{width: '150px'}}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  renderFoot() {
    return (
      <div styleName="table">
        <div styleName="info">
          <div styleName="fee">
            <span styleName="label">Fee:</span>
            <span styleName="value">
              <span styleName="value1">10</span>
              <span styleName="value2">.01 LHT</span>
            </span>
            <span styleName="percentage">1.00%</span>
          </div>
          <div styleName="total">
            <span styleName="label">Total:</span>
            <span styleName="value">
              <span styleName="value1">1 512 000</span>
              <span styleName="value2">.00124 ETH</span>
            </span>
          </div>
        </div>
        <div styleName="actions">
          <RaisedButton label="Send" primary
            onTouchTap={() => this.handleSend()}
          />
        </div>
      </div>
    )
  }

  handleSend() {
    this.validate()
    if (this.state.valid) {
      this.props.transfer({
        token: this.state.token.value,
        amount: this.state.amount.value,
        recipient: this.state.recipient.value
      })
    }
  }

  handleChangeCurrency(currency) {
    this.setState({
      token: {
        value: this.props.tokens.get(currency)
      }
    })
  }

  handleGasPriceChanged(value) {
    this.setState({
      gasPrice: {
        value
      }
    })
  }

  handleRecipientChanged(value) {
    this.setState({
      recipient: {
        value,
        errors: this.state.recipient.errors
      }
    })
  }

  handleAmountChanged(value) {
    this.setState({
      amount: {
        value: value,
        errors: this.state.amount.errors
      }
    })
  }

  handleOpen(open) {
    this.setState({
      open
    })
  }
}

function mapDispatchToProps (dispatch) {
  return {
    transfer: ({ token, amount, recipient }) => dispatch(transfer(token, amount, recipient))
  }
}

function mapStateToProps (state) {
  let session = state.get('session')
  let wallet = state.get('wallet')
  return {
    account: session.account,
    tokens: wallet.tokens
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendTokens)
