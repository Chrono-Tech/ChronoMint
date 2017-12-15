import globalStyles from 'layouts/partials/styles'
import iconTokenDefaultSVG from 'assets/img/avaToken.svg'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import BigNumber from 'bignumber.js'
import { IPFSImage } from 'components'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Immutable from 'immutable'
import { RaisedButton } from 'material-ui'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import TokensCollection from 'models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { change, Field, formPropTypes, formValueSelector, isInvalid, reduxForm } from 'redux-form/immutable'
import { approveTokensForExchange, getTokensAllowance } from 'redux/exchange/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import BalancesCollection from 'models/tokens/BalancesCollection'
import TokenModel from 'models/tokens/TokenModel'
import Amount from 'models/Amount'
import './BuyTokensDialog.scss'
import validate from './validate'

function prefix (token) {
  return `components.exchange.BuyTokensDialog.${token}`
}

export const FORM_EXCHANGE_BUY_TOKENS = 'ExchangeTokensForm'

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  const selector = formValueSelector(FORM_EXCHANGE_BUY_TOKENS)
  const invalidSelector = isInvalid(FORM_EXCHANGE_BUY_TOKENS)
  return {
    tokens,
    balances: state.get(DUCK_MAIN_WALLET).balances(),
    allowances: state.get(DUCK_MAIN_WALLET).allowances(),
    buy: selector(state, 'buy'),
    sell: selector(state, 'sell'),
    formInvalid: invalidSelector(state),
  }
}

const onSubmit = (values) => {
  return new BigNumber(values.get('buy'))
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_EXCHANGE_BUY_TOKENS, validate, onSubmit })
export default class BuyTokensForm extends React.PureComponent {
  static propTypes = {
    exchangeToken: PropTypes.instanceOf(TokenModel),
    exchange: PropTypes.instanceOf(ExchangeOrderModel),
    filter: PropTypes.instanceOf(Immutable.Map),
    isBuy: PropTypes.bool,
    tokens: PropTypes.instanceOf(TokensCollection),
    balances: PropTypes.instanceOf(BalancesCollection),
    dispatch: PropTypes.func,
    ...formPropTypes,
  }

  componentDidMount () {
    this.props.balances.item(this.props.exchangeToken.id()) &&
    !this.props.isBuy &&
    this.props.dispatch(getTokensAllowance(this.props.exchange))
  }

  handleSetPrice = (e) => {
    let value = e.target.value
    const price = this.props.isBuy ? this.props.exchange.sellPrice() : this.props.exchange.buyPrice()
    if (e.target.name === 'buy') {
      this.props.dispatch(change(FORM_EXCHANGE_BUY_TOKENS, 'sell', new BigNumber(parseFloat(value) || 0).mul(price)))
    } else {
      this.props.dispatch(change(FORM_EXCHANGE_BUY_TOKENS, 'buy', new BigNumber(parseFloat(value) || 0).div(price)))
    }
  }

  handleApprove = () => {
    const allowance = this.props.allowances.get(this.props.exchangeToken.id())
      ? this.props.allowances.get(this.props.exchangeToken.id()).get(this.props.exchange.address())
      : 0
    const token = this.props.tokens.item(this.props.exchangeToken.id())

    if (allowance > 0) {
      this.props.dispatch(approveTokensForExchange(this.props.exchange, token, new BigNumber(0)))
    } else {
      this.props.dispatch(approveTokensForExchange(this.props.exchange, token, new BigNumber(this.props.buy)))
    }
  }

  render () {
    let showWarningMessage = false
    if (!this.props.balances.item(this.props.exchangeToken.id())) {
      showWarningMessage = true
    }
    const exchangeToken = this.props.tokens.item(this.props.exchange.asset())
    const ethToken = this.props.tokens.item('ETH')

    const allowance = this.props.allowances.get(this.props.exchangeToken.id())
      ? this.props.allowances.get(this.props.exchangeToken.id())
      : 0
    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='row'>
          <div styleName='leftCol'>
            {
              showWarningMessage &&
              <div styleName='warningMessage'>
                <i className='material-icons'>warning</i>
                <Translate value={prefix('needToCreateWallet')} symbol={this.props.exchange.symbol()} />
              </div>
            }
            <div styleName='property'>
              <div styleName='label'><Translate value={prefix('traderAddress')} />:</div>
              <div styleName='value'>
                <span>{this.props.exchange.address()}</span>
              </div>
            </div>
            <div styleName='property'>
              <div styleName='label'><Translate value={prefix('price')} />:</div>
              <div>
                <TokenValue
                  value={new Amount(this.props.isBuy ? this.props.exchange.sellPrice() : this.props.exchange.buyPrice(), ethToken.symbol())}
                />
              </div>
            </div>
            <div styleName='property'>
              <div styleName='label'><Translate value={prefix('tradeLimits')} />:</div>
              <div>
                <TokenValue
                  value={new Amount(
                    this.props.isBuy ? this.props.exchange.assetBalance() : this.props.exchange.ethBalance(),
                    this.props.isBuy ? exchangeToken.symbol() : ethToken.symbol(),
                  )}
                />
              </div>
            </div>
            {
              !this.props.isBuy && allowance > 0 &&
              <div styleName='property'>
                <div styleName='label'><Translate value={prefix('allowance')} />:</div>
                <div>
                  <TokenValue
                    value={allowance}
                    symbol={exchangeToken.symbol()}
                  />
                </div>
              </div>
            }
          </div>
          <div styleName='rightCol'>
            <div className='ByTokensDialog__form'>
              <div className='row' styleName='amountsWrap'>
                <div className='col-xs-2 col-sm-1' styleName='mobileFlex'>
                  <div styleName='input'>
                    <Field
                      component={TextField}
                      name='buy'
                      fullWidth
                      floatingLabelText={(
                        <span><Translate value={prefix('amountIn')} />&nbsp;{exchangeToken.symbol()}</span>)}
                      onChange={this.handleSetPrice}
                    />
                  </div>
                  <div styleName='iconMobile' style={{ background: `#05326a` }}>
                    <IPFSImage
                      multihash={exchangeToken.icon()}
                      fallback={iconTokenDefaultSVG}
                      styleName='iconTitle'
                    />
                    <div styleName='tokenTitleMobile'>{exchangeToken.symbol()}</div>
                  </div>
                </div>
                <div className='col-xs-2 col-sm-1' styleName='mobileFlex'>
                  <div styleName='input'>
                    <Field
                      component={TextField}
                      name='sell'
                      fullWidth
                      floatingLabelText={(
                        <span><Translate value={prefix('amountIn')} />&nbsp;{ethToken.symbol()}</span>)}
                      onChange={this.handleSetPrice}
                    />
                  </div>
                  <div styleName='iconMobile' style={{ background: `#05326a` }}>
                    <IPFSImage
                      multihash={ethToken.icon()}
                      fallback={iconTokenDefaultSVG}
                      styleName='iconTitle'
                    />
                    <div styleName='tokenTitleMobile'>{ethToken.symbol()}</div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-2'>
                  <div styleName='actions'>
                    {!this.props.isBuy &&
                    <div>
                      {allowance > 0
                        ? <RaisedButton
                          type='button'
                          label={(
                            <span styleName='buttonLabel'>
                              <Translate value={prefix('revoke')} />
                            </span>
                          )}
                          primary
                          onTouchTap={this.handleApprove}
                          {...globalStyles.buttonRaisedMultyLine}
                        />
                        : <RaisedButton
                          disabled={this.props.pristine || !this.props.valid || showWarningMessage}
                          type='button'
                          label={(
                            <span styleName='buttonLabel'>
                              <Translate value={prefix('approve')} />
                            </span>
                          )}
                          primary
                          onClick={this.handleApprove}
                          {...globalStyles.buttonRaisedMultyLine}
                        />
                      }
                    </div>
                    }
                    <RaisedButton
                      disabled={!this.props.valid || (!this.props.isBuy && allowance.toString() !== this.props.buy) || showWarningMessage}
                      type='submit'
                      label={<span styleName='buttonLabel'><Translate value={prefix('sendRequest')} /></span>}
                      {...globalStyles.buttonRaisedMultyLine}
                      primary
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

