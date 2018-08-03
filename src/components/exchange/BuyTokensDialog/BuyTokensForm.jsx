/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button, IPFSImage } from 'components'
import iconTokenDefaultSVG from 'assets/img/avaToken.svg'
import BigNumber from 'bignumber.js'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Immutable from 'immutable'
import ExchangeOrderModel from '@chronobank/core/models/exchange/ExchangeOrderModel'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import { change, Field, formPropTypes, formValueSelector, isInvalid, reduxForm } from 'redux-form/immutable'
import { approveTokensForExchange, getTokensAllowance } from '@chronobank/core/redux/exchange/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import BalancesCollection from '@chronobank/core/models/tokens/BalancesCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import Amount from '@chronobank/core/models/Amount'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import { FORM_EXCHANGE_BUY_TOKENS } from 'components/constants'
import './BuyTokensDialog.scss'
import validate from './validate'

function prefix (token) {
  return `components.exchange.BuyTokensDialog.${token}`
}

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  const selector = formValueSelector(FORM_EXCHANGE_BUY_TOKENS)
  const invalidSelector = isInvalid(FORM_EXCHANGE_BUY_TOKENS)
  const wallet = getMainEthWallet(state)

  return {
    tokens,
    balances: wallet.balances(),
    allowances: wallet.allowances(),
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
    const ethToken = this.props.tokens.item('ETH')
    let value = e.target.value
    let price = this.props.isBuy ? this.props.exchange.sellPrice() : this.props.exchange.buyPrice()
    price = ethToken.removeDecimals(price)

    if (e.target.name === 'buy') {
      this.props.dispatch(change(FORM_EXCHANGE_BUY_TOKENS, 'sell', new BigNumber(parseFloat(value) || 0).mul(price)))
    } else {
      this.props.dispatch(change(FORM_EXCHANGE_BUY_TOKENS, 'buy', new BigNumber(parseFloat(value) || 0).div(price)))
    }
  }

  handleApprove = () => {
    const token = this.props.tokens.item(this.props.exchangeToken.id())
    const allowance = this.props.allowances.item(this.props.exchange.address(), token.id()).amount()

    if (allowance > 0) {
      this.props.dispatch(approveTokensForExchange(this.props.exchange, token, new Amount(0, 'ETH')))
    } else {
      this.props.dispatch(approveTokensForExchange(this.props.exchange, token, new Amount(token.addDecimals(this.props.buy), token.symbol())))
    }
  }

  render () {
    let showWarningMessage = false
    if (!this.props.balances.item(this.props.exchangeToken.id())) {
      showWarningMessage = true
    }
    const exchangeToken = this.props.tokens.item(this.props.exchange.symbol())
    const ethToken = this.props.tokens.item('ETH')

    const allowance = this.props.allowances.item(this.props.exchange.address(), exchangeToken.id()).amount()

    const price = new Amount(
      this.props.isBuy
        ? this.props.exchange.sellPrice()
        : this.props.exchange.buyPrice(),
      ethToken.symbol(),
    )
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
                  value={price}
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
                  <TokenValue value={allowance} />
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
                        ? <Button
                          type='button'
                          label={(
                            <span styleName='buttonLabel'>
                              <Translate value={prefix('revoke')} />
                            </span>
                          )}
                          onClick={this.handleApprove}
                        />
                        : <Button
                          disabled={this.props.pristine || !this.props.valid || showWarningMessage}
                          type='button'
                          label={(
                            <span styleName='buttonLabel'>
                              <Translate value={prefix('approve')} />
                            </span>
                          )}
                          onClick={this.handleApprove}
                        />
                      }
                    </div>
                    }
                    <Button
                      disabled={!this.props.valid || (!this.props.isBuy && exchangeToken.removeDecimals(allowance).toString() !== this.props.buy) || showWarningMessage}
                      type='submit'
                      label={<Translate value={prefix('sendRequest')} />}
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

