import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { transfer } from 'redux/wallet/actions'
import BigNumber from 'bignumber.js'
import _ from 'lodash'

import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

import web3Provider from 'network/Web3Provider'
import web3Converter from 'utils/Web3Converter'

import { MuiThemeProvider, SelectField, MenuItem, TextField, RaisedButton, Slider, Toggle } from 'material-ui'
import { IPFSImage } from 'components'

import IconSection from './IconSection'
import ColoredSection from './ColoredSection'

import styles from './styles'
import inversedTheme from 'styles/themes/inversed.js'
import TokenValue from './TokenValue/TokenValue'
import './SendTokens.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
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
    // TODO @bshevchenko: use web3Provider.estimateGas instead of this fixed value
    transferCost: 21000,
    gasPriceMultiplier: 0,
    currency: 'ETH'
  }

  constructor (props) {
    super(props)

    this.validators = {
      recipient: (recipient) => {
        return new ErrorList()
          .add(validator.required(recipient))
          .add(validator.address(recipient))
          .add(recipient === props.account ? 'errors.cantSentToYourself' : null)
          .getErrors()
      },
      amount: (amount) => {

        const token = this.state.token.value
        const balance = new BigNumber(String(token.balance() || 0))
        const format = validator.currencyNumber(amount, token.decimals())
        return new ErrorList()
          .add(validator.required(amount))
          .add((this.state.totals && balance.lt(this.state.totals.total)) ? 'errors.notEnoughTokens' : null)
          .add(format ? {value: format, decimals: token.decimals()} : null)
          // .add(balance.dif)
          .getErrors()
      }
    }

    this.debouncedValidate = _.debounce(this.validate, 500)

    this.state = {
      token: {
        value: props.tokens.get(props.currency)
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

  validate (force) {

    try {
      // TODO @bshevchenko: MINT-289 Wallet gas price / limit, custom data, gas fees
      // const fee = (new BigNumber(this.state.gasPrice.value))
      //  .mul(new BigNumber(this.props.transferCost))
      //  .mul(new BigNumber(Math.pow(2, this.state.gasPriceMultiplier.value)))
      const fee = new BigNumber(0)
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

  componentDidMount () {
    this.setupGasPrice()
  }

  componentWillReceiveProps (nextProps) {
    const name = this.state.token.value.symbol()
    this.setState({
      token: {
        value: nextProps.tokens.get(name)
      }
    })
  }

  render () {
    const token = this.state.token.value
    return (
      <ColoredSection
        styleName='root'
        head={this.renderHead({token})}
        body={this.renderBody({token})}
        foot={!this.state.totals ? null : this.renderFoot({token})}
      />
    )
  }

  renderHead ({token}) {
    const symbol = token.symbol().toUpperCase()
    const tokens = this.props.tokens.entrySeq().toArray()

    return (
      <div>
        <IconSection
          title={this.props.title}
          iconComponent={(
            <IPFSImage
              styleName='content'
              multihash={token.icon()}
              fallback={ICON_OVERRIDES[symbol]} />
          )}
        >
          <div styleName='form'>
            <MuiThemeProvider theme={inversedTheme}>
              <SelectField
                ref={(select) => { this.select = select }}
                style={styles.widgets.sendTokens.currency.style}
                labelStyle={styles.widgets.sendTokens.currency.labelStyle}
                menuItemStyle={styles.widgets.sendTokens.currency.menuItemStyle}
                value={token.symbol()}
                onChange={(e, i, value) => this.handleChangeCurrency(value)}
              >
                {tokens.map(([name]) => (
                  <MenuItem key={name} value={name} primaryText={name.toUpperCase()} />
                ))}
              </SelectField>
            </MuiThemeProvider>
          </div>
        </IconSection>
        <div styleName='balance'>
          <div styleName='label'>Balance:</div>
          <div styleName='value'>
            <TokenValue
              isInvert
              value={token.balance()}
              symbol={token.symbol()}
            />
          </div>
        </div>
      </div>
    )
  }

  renderBody () {
    return (
      <div styleName='form'>
        <div>
          <TextField
            fullWidth
            onChange={(event, value) => this.handleRecipientChanged(value)}
            value={this.state.recipient.value}
            floatingLabelText='Recipient address'
            errorText={this.state.recipient.dirty && this.state.recipient.errors}
          />
        </div>
        <div>
          <TextField
            style={{width: '150px'}}
            onChange={(event, value) => this.handleAmountChanged(value)}
            value={this.state.amount.value}
            floatingLabelText='Amount'
            errorText={this.state.amount.dirty && this.state.amount.errors}
          />
        </div>
        <div>
          <div styleName='gas'>
            <div styleName='gas-label'>
              Gas price:
            </div>
            <div styleName='gas-value'>
              <Slider
                min={-2} max={2} step={1}
                value={this.state.gasPriceMultiplier.value}
                onChange={(event, value) => this.handleGasPriceMultiplierChanged(value)}
              />
              <div styleName='axis'>
                <div styleName='axis-label'>Low</div>
                <div styleName='axis-label'>Medium</div>
                <div styleName='axis-label'>High</div>
              </div>
            </div>
            <div styleName='gas-actions'>
              <span styleName='action-label'>Advanced: </span>
              <span styleName='action-control'>
                <Toggle toggled={this.state.open} onToggle={(event, value) => this.handleOpen(value)} />
              </span>
            </div>
          </div>
        </div>
        {!this.state.open ? null : (
          <div>
            <div>
              <TextField
                floatingLabelText='Gas limit'
                style={{width: '330px'}}
              />
            </div>
            <div>
              <TextField
                floatingLabelText='Custom data'
                style={{width: '150px'}}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  renderFoot ({token}) {

    const fee = this.state.totals.fee
    const total = this.state.totals.total
    const percentage = fee.mul(100).div(total).toFixed(2).toString()

    return (
      <div styleName='table'>
        <div styleName='info'>
          <div styleName='fee'>
            <span styleName='label'>Fee:</span>
            <span styleName='value'>
              <TokenValue
                value={fee}
                symbol={token.symbol()}
              />
            </span>
            <span styleName='percentage'>{percentage}%</span>
          </div>

          <div styleName='total'>
            <span styleName='label'>Total:</span>
            <span styleName='value'>
              <TokenValue
                value={total.toString(10)}
                symbol={token.symbol()}
              />
            </span>
          </div>
        </div>
        <div styleName='actions'>
          <RaisedButton
            label='Send'
            primary
            disabled={!this.state.valid}
            onTouchTap={() => this.handleSend()}
          />
        </div>
      </div>
    )
  }

  handleChangeCurrency (currency) {

    const token = this.props.tokens.get(currency)
    this.setState({
      token: {
        value: token
      }
    })

    this.setupGasPrice()
  }

  handleGasPriceMultiplierChanged (value) {
    this.setState({
      gasPriceMultiplier: {
        value
      },
      valid: false
    })
    this.debouncedValidate()
  }

  handleRecipientChanged (value) {
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

  handleAmountChanged (value) {
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

  handleSend () {
    this.validate(true)
    if (this.state.valid) {

      this.props.transfer({
        token: this.state.token.value,
        amount: this.state.amount.value,
        recipient: this.state.recipient.value,
        total: this.state.totals.total // Need to pass total or fee to update balance manually before transaction complete
      })

      this.setState({
        amount: {
          value: '',
          dirty: false,
          errors: null
        },
        recipient: {
          value: '',
          dirty: false,
          errors: null
        },
        valid: false,
        totals: null
      })
    }
  }

  handleOpen (open) {
    this.setState({
      open
    })
  }

  async setupGasPrice () {

    this.setState({
      gasPrice: {
        dirty: false
      }
    })

    const gasPrice = web3Converter.fromWei(await web3Provider.getGasPrice())

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
    transfer: ({token, amount, recipient, total}) => {
      return dispatch(transfer(token, amount, recipient, total))
    }
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
