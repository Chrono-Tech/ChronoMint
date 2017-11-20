import iconTokenDefaultSVG from 'assets/img/avaToken.svg'
import BigNumber from 'bignumber.js'
import { IPFSImage } from 'components'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialog from 'components/dialogs/ModalDialog'
import Immutable from 'immutable'
import { RaisedButton } from 'material-ui'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import TokensCollection from 'models/exchange/TokensCollection'
import TokenModel from 'models/TokenModel'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { CSSTransitionGroup } from 'react-transition-group'
import { TextField } from 'redux-form-material-ui'
import { change, Field, reduxForm, formPropTypes } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import { getCurrentWallet } from 'redux/wallet/actions'
import { exchange } from 'redux/exchange/actions'
import './BuyTokensDialog.scss'
import styles from './styles'
import validate from './validate'

function prefix (token) {
  return `components.exchange.exchangeTokensDialog.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
  }
}

function mapStateToProps (state) {
  const exchange = state.get('exchange')
  return {
    tokens: exchange.tokens(),
    eth: getCurrentWallet(state).tokens().get('ETH'),
  }
}

export const FORM_EXCHANGE_BUY_TOKENS = 'ExchangeexchangeTokensForm'

const onSubmit = (values, dispatch, props) => {
  dispatch(exchange(props.isBuy, new BigNumber(values.get('buy')), props.exchange))
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_EXCHANGE_BUY_TOKENS, validate, onSubmit })
export default class exchangeTokensDialog extends React.Component {
  static propTypes = {
    exchange: PropTypes.instanceOf(ExchangeOrderModel),
    handleClose: PropTypes.func,
    filter: PropTypes.instanceOf(Immutable.Map),
    isBuy: PropTypes.bool,
    tokens: PropTypes.instanceOf(TokensCollection),
    eth: PropTypes.instanceOf(TokenModel),
    dispatch: PropTypes.func,
    ...formPropTypes,
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

  render () {
    const exchangeToken = this.props.tokens.getBySymbol(this.props.exchange.symbol())
    const ethToken = this.props.eth

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <ModalDialog onClose={this.props.handleClose}>
          <div styleName='root'>
            <div styleName='header'>
              <div styleName='headerRow'>
                <div styleName='headerRightCol'>
                  <div styleName='title'>
                    <Translate
                      value={prefix(this.props.isBuy ? 'buy' : 'sell')}
                    />{` ${this.props.exchange.symbol()} `}
                    <Translate value={prefix('tokens')} />
                  </div>
                  <div styleName='balanceHeader'>
                    <div styleName='balanceTitle'><Translate value={prefix('balance')} /></div>
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
                    <div styleName='label'><Translate value={prefix('traderAddress')} />:</div>
                    <div styleName='value'>
                      <span>{this.props.exchange.address()}</span>
                    </div>
                  </div>
                  <div styleName='property'>
                    <div styleName='label'><Translate value={prefix('tradeLimits')} />:</div>
                    <div>
                      <TokenValue
                        value={this.props.exchange.assetBalance()}
                        symbol={this.props.exchange.symbol()}
                      />
                    </div>
                  </div>
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
                            floatingLabelStyle={styles.TextField.floatingLabelStyle}
                            floatingLabelText={(
                              <span><Translate value={prefix('amountIn')} />&nbsp;{exchangeToken.symbol()}</span>)}
                            style={styles.TextField.style}
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
                            floatingLabelStyle={styles.TextField.floatingLabelStyle}
                            floatingLabelText={(
                              <span><Translate value={prefix('amountIn')} />&nbsp;{ethToken.symbol()}</span>)}
                            style={styles.TextField.style}
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
                          <RaisedButton type='submit' label={<Translate value={prefix('sendRequest')} />} primary />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

