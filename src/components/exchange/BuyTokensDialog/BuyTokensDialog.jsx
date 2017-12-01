import iconTokenDefaultSVG from 'assets/img/avaToken.svg'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import BigNumber from 'bignumber.js'
import { IPFSImage } from 'components'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialog from 'components/dialogs/ModalDialog'
import Immutable from 'immutable'
import { RaisedButton } from 'material-ui'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import TokensCollection from 'models/exchange/TokensCollection'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { change, Field, formPropTypes, formValueSelector, isInvalid, reduxForm } from 'redux-form/immutable'
import { approveTokensForExchange, DUCK_EXCHANGE, exchange, getTokensAllowance } from 'redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'
import './BuyTokensDialog.scss'
import validate from './validate'

function prefix (token) {
  return `components.exchange.BuyTokensDialog.${token}`
}

export const FORM_EXCHANGE_BUY_TOKENS = 'ExchangeTokensForm'

function mapStateToProps (state) {
  const exchangeState = state.get(DUCK_EXCHANGE)
  const selector = formValueSelector(FORM_EXCHANGE_BUY_TOKENS)
  const invalidSelector = isInvalid(FORM_EXCHANGE_BUY_TOKENS)
  return {
    tokens: exchangeState.tokens(),
    usersTokens: state.get(DUCK_MAIN_WALLET).tokens(),
    buy: selector(state, 'buy'),
    sell: selector(state, 'sell'),
    formInvalid: invalidSelector(state),
  }
}

const onSubmit = (values, dispatch, props) => {
  dispatch(modalsClose())
  dispatch(exchange(props.isBuy, new BigNumber(values.get('buy')), props.exchange))
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_EXCHANGE_BUY_TOKENS, validate, onSubmit })
export default class BuyTokensDialog extends React.PureComponent {
  static propTypes = {
    exchange: PropTypes.instanceOf(ExchangeOrderModel),
    filter: PropTypes.instanceOf(Immutable.Map),
    isBuy: PropTypes.bool,
    tokens: PropTypes.instanceOf(TokensCollection),
    usersTokens: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func,
    ...formPropTypes,
  }

  componentDidMount () {
    !this.props.isBuy && this.props.dispatch(getTokensAllowance(this.props.exchange))
  }

  handleSetPrice = (e) => {
    let value = e.target.value
    const price = this.props.isBuy ? this.props.exchange.sellPrice() : this.props.exchange.buyPrice()
    if (e.target.name === 'buy') {
      this.props.dispatch(change(FORM_EXCHANGE_BUY_TOKENS, 'sell', new BigNumber(value || 0).mul(price)))
    } else {
      this.props.dispatch(change(FORM_EXCHANGE_BUY_TOKENS, 'buy', new BigNumber(value || 0).div(price)))
    }
  }

  handleApprove = () => {
    const allowance = this.props.usersTokens.get(this.props.exchange.symbol()).allowance(this.props.exchange.address())
    const token = this.props.usersTokens.get(this.props.exchange.symbol())

    if (allowance > 0) {
      this.props.dispatch(approveTokensForExchange(this.props.exchange, token, new BigNumber(0)))
    } else {
      this.props.dispatch(approveTokensForExchange(this.props.exchange, token, this.props.buy))
    }
  }

  render () {
    const exchangeToken = this.props.tokens.getBySymbol(this.props.exchange.symbol())
    const ethToken = this.props.usersTokens.get('ETH')

    const allowance = this.props.usersTokens.get(this.props.exchange.symbol()).allowance(this.props.exchange.address())
    return (
      <ModalDialog>
        <div styleName='root'>
          <div styleName='header'>
            <div styleName='headerRow'>
              <div styleName='headerRightCol'>
                <div styleName='title'>
                  <Translate
                    value={prefix(this.props.isBuy ? 'buy' : 'sell')}
                  />{` ${this.props.exchange.symbol()} `}
                  <Translate value={prefix('tokens')}/>
                </div>
                <div styleName='balanceHeader'>
                  <div styleName='balanceTitle'><Translate value={prefix('balance')}/></div>
                  <div styleName='balanceValue'>
                    <TokenValue
                      isInvert
                      value={this.props.isBuy ? ethToken.balance() : exchangeToken.balance()}
                      symbol={this.props.isBuy ? ethToken.symbol() : exchangeToken.symbol()}
                    />
                  </div>
                </div>
              </div>
              <div styleName='headerLeftCol'>
                <div className='ByTokensDialog__icons'>
                  <div className='row'>
                    <div className='col-xs-1'>
                      <div styleName='icon' style={{ background: `#05326a` }}>
                        <IPFSImage
                          multihash={exchangeToken.icon()}
                          fallback={iconTokenDefaultSVG}
                          styleName='iconTitle'
                        />
                        <div styleName='tokenTitle'>{exchangeToken.symbol()}</div>
                      </div>
                    </div>
                    <div className='col-xs-1'>
                      <div styleName='icon' style={{ background: `#5c6bc0` }}>
                        <IPFSImage
                          multihash={ethToken.icon()}
                          fallback={iconTokenDefaultSVG}
                          styleName='iconTitle'
                        />
                        <div styleName='tokenTitle'>{ethToken.symbol()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='row'>
              <div styleName='leftCol'>
                <div styleName='property'>
                  <div styleName='label'><Translate value={prefix('traderAddress')}/>:</div>
                  <div styleName='value'>
                    <span>{this.props.exchange.address()}</span>
                  </div>
                </div>
                <div styleName='property'>
                  <div styleName='label'><Translate value={prefix('tradeLimits')}/>:</div>
                  <div>
                    <TokenValue
                      value={this.props.isBuy ? this.props.exchange.assetBalance() : this.props.exchange.ethBalance()}
                      symbol={this.props.isBuy ? exchangeToken.symbol() : ethToken.symbol()}
                    />
                  </div>
                </div>
                {
                  !this.props.isBuy && allowance > 0 &&
                  <div styleName='property'>
                    <div styleName='label'><Translate value={prefix('allowance')}/>:</div>
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
                            <span><Translate value={prefix('amountIn')}/>&nbsp;{exchangeToken.symbol()}</span>)}
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
                            <span><Translate value={prefix('amountIn')}/>&nbsp;{ethToken.symbol()}</span>)}
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
                        <RaisedButton
                          type='button'
                          label={<Translate value={prefix(allowance > 0 ? 'revoke' : 'approve')}/>}
                          primary
                          onTouchTap={this.handleApprove}
                        />
                        }
                        <RaisedButton
                          disabled={this.props.formInvalid || (!this.props.isBuy && allowance.toString() !== this.props.buy)}
                          type='submit'
                          label={<Translate value={prefix('sendRequest')}/>}
                          primary
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ModalDialog>
    )
  }
}

