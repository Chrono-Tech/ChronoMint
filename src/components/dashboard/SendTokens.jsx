import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { transfer } from 'redux/wallet/actions'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'
import BigNumber from 'bignumber.js'
import _ from 'lodash'

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
    // The power of 2 from -2 to 2.
    // This multiplier would be used to determine gas price.
    gasPriceMultiplier: PropTypes.number,
    transferCost: PropTypes.number,
    transfer: PropTypes.func,
    open: PropTypes.bool
  }

  static defaultProps = {
    transferCost: 21000,
    gasPriceMultiplier: 0,
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

        const token = this.state.token.value
        const balance = new BigNumber(String(token.balance() || 0))
        const format = validator.currencyNumber(amount, token.decimals())
        return new ErrorList()
          .add(validator.required(amount))
          .add((this.state.totals && balance.lt(this.state.totals.total)) ? 'errors.notEnoughTokens' : null)
          .add(format ? { value: format, decimals: token.decimals() } : null)
          // .add(balance.dif)
          .getErrors()
      },
    }

    this.debouncedValidate = _.debounce(this.validate, 500)

    this.state = {
      token: {
        value: props.tokens.get(props.currency),
      },
      recipient: {
        value: '',
        dirty: false,
        errors: null
      },
      amount: {
        value: '',
        dirty: false,
        errors: null
      },
      gasPriceMultiplier: {
        value: props.gasPriceMultiplier
      },
      totals: null,
      valid: false,
      open: props.open
    }
  }

  validate(force) {

    try {
      const fee = (new BigNumber(this.state.gasPrice.value))
        .mul(new BigNumber(this.props.transferCost))
        .mul(new BigNumber(Math.pow(2, this.state.gasPriceMultiplier.value)))

      const total = new BigNumber(this.state.amount.value).plus(fee)

      this.setState({
        totals: {
          fee,
          total
        }
      })

    } catch (e) {
      this.setState({
        totals: null
      })
    }

    const state = {}

    state.recipient = {
      ...this.state.recipient,
      dirty: force || this.state.recipient.dirty,
      errors: this.validators.recipient(this.state.recipient.value)
    }

    state.amount = {
      ...this.state.amount,
      dirty: force || this.state.amount.dirty,
      errors: this.validators.amount(this.state.amount.value)
    }

    this.setState({
      ...state,
      valid: this.state.totals
          && (state.recipient.dirty && !state.recipient.errors)
          && (state.amount.dirty && !state.amount.errors)
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

    this.setupGasPrice()
  }

  render() {

    const token = this.state.token.value

    return (
      <ColoredSection styleName="root"
        head={this.renderHead({ token })}
        body={this.renderBody({ token })}
        foot={!this.state.totals ? null : this.renderFoot({ token })}
      />
    )
  }

  renderHead({ token }) {

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
            errorText={this.state.recipient.dirty && this.state.recipient.errors}
          />
        </div>
        <div>
          <TextField style={{width: '150px'}}
            onChange={(event, value) => this.handleAmountChanged(value)}
            value={this.state.amount.value}
            floatingLabelText="Amount"
            errorText={this.state.amount.dirty && this.state.amount.errors}
          />
        </div>
        <div>
          <div styleName="gas">
            <div styleName="gas-label">
              Gas price:
            </div>
            <div styleName="gas-value">
              <Slider min={-2} max={2} step={1}
                value={this.state.gasPriceMultiplier.value}
                onChange={(event, value) => this.handleGasPriceMultiplierChanged(value)}
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

  renderFoot({ token }) {

    const fee = this.state.totals.fee
    const total = this.state.totals.total
    const percentage = fee.mul(100).div(total).toFixed(2).toString()

    const [fee1, fee2] = fee.toString(10).split('.')
    const [total1, total2] = total.toString(10).split('.')

    return (
      <div styleName="table">
        <div styleName="info">
          <div styleName="fee">
            <span styleName="label">Fee:</span>
            <span styleName="value">
              <span styleName="value1">{fee1}</span>
              {!fee2 ? null : (
                <span styleName="value2">.{fee2}</span>
              )}
              <span styleName="value3">&nbsp;{token.symbol()}</span>
            </span>
            <span styleName="percentage">{percentage}%</span>
          </div>
          <div styleName="total">
            <span styleName="label">Total:</span>
            <span styleName="value">
              <span styleName="value1">{total1}</span>
              {!total2 ? null : (
                <span styleName="value2">.{total2}</span>
              )}
              <span styleName="value3">&nbsp;{token.symbol()}</span>
            </span>
          </div>
        </div>
        <div styleName="actions">
          <RaisedButton label="Send" primary
            disabled={!this.state.valid}
            onTouchTap={() => this.handleSend()}
          />
        </div>
      </div>
    )
  }

  handleChangeCurrency(currency) {

    const token = this.props.tokens.get(currency)
    this.setState({
      token: {
        value: token,
      }
    })

    this.setupGasPrice()
  }

  handleGasPriceMultiplierChanged(value) {
    this.setState({
      gasPriceMultiplier: {
        value
      },
      valid: false
    })
    this.debouncedValidate()
  }

  handleRecipientChanged(value) {
    this.setState({
      recipient: {
        value,
        dirty: true,
        errors: null
      },
      valid: false
    })
    this.debouncedValidate()
  }

  handleAmountChanged(value) {
    this.setState({
      amount: {
        value,
        dirty: true,
        errors: null
      },
      valid: false
    })
    this.debouncedValidate()
  }

  handleSend() {
    this.validate(true)
    if (this.state.valid) {
      // TODO @ipavlenko: Provide a way to send transaction with custom gas price
      this.props.transfer({
        token: this.state.token.value,
        amount: this.state.amount.value,
        recipient: this.state.recipient.value
      })
    }
  }

  handleOpen(open) {
    this.setState({
      open
    })
  }

  async setupGasPrice() {

    this.setState({
      gasPrice: {
        dirty: false
      }
    })

    const gasPrice = await this.state.token.value.dao().getGasPrice()

    this.setState({
      gasPrice: {
        value: gasPrice,
        dirty: true
      }
    })
    this.debouncedValidate()
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
