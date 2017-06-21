import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    currency: PropTypes.string,
    gasPrice: PropTypes.number,
    open: PropTypes.bool
  }

  static defaultProps = {
    gasPrice: 0.5,
    currency: 'ETH'
  }

  constructor(props) {
    super(props)

    this.state = {
      currency: props.currency,
      gasPrice: props.gasPrice,
      open: props.open
    }
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
    const tokens = this.props.tokens.entrySeq().toArray()
    const token = (this.props.tokens && this.state.currency)
      ? this.props.tokens.get(this.state.currency)
      : null
    const icon = token
      ? token.icon() || ICON_OVERRIDES[token.name().toUpperCase()]
      : null

    return (
      <div>
        <IconSection title={this.props.title} icon={icon}>
          <div styleName="form">
            <MuiThemeProvider theme={inversedTheme}>
              <SelectField
                className="SendTokens__select"
                ref={(select) => { this.select = select}}
                style={styles.widgets.sendTokens.currency.style}
                labelStyle={styles.widgets.sendTokens.currency.labelStyle}
                menuItemStyle={styles.widgets.sendTokens.currency.menuItemStyle}
                value={this.state.currency}
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
            <span styleName="value1">1 512 000</span>
            <span styleName="value2">.00123 ETH</span>
          </div>
        </div>
      </div>
    )
  }

  renderBody() {
    return (
      <div styleName="form">
        <div>
          <TextField
            floatingLabelText="Recepient address"
            style={{width: '330px'}}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="Amount"
            style={{width: '150px'}}
          />
        </div>
        <div>
          <div styleName="gas">
            <div styleName="gas-label">
              Gas price:
            </div>
            <div styleName="gas-value">
              <Slider min={0} max={1} step={0.1}
                value={this.state.gasPrice}
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
          <RaisedButton label="Send" primary />
        </div>
      </div>
    )
  }

  handleChangeCurrency(currency) {
    this.setState({
      ...this.state,
      currency
    })
  }

  handleGasPriceChanged(gasPrice) {
    this.setState({
      ...this.state,
      gasPrice
    })
  }

  handleOpen(open) {
    this.setState({
      ...this.state,
      open
    })
  }
}

function mapStateToProps (state) {
  let wallet = state.get('wallet')

  return {
    isTokensLoaded: !wallet.tokensFetching,
    tokens: wallet.tokens
  }
}

export default connect(mapStateToProps)(SendTokens)
