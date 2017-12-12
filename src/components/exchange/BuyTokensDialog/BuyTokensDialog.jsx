import iconTokenDefaultSVG from 'assets/img/avaToken.svg'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { IPFSImage } from 'components'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialog from 'components/dialogs/ModalDialog'
import Immutable from 'immutable'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import TokensCollection from 'models/exchange/TokensCollection'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_EXCHANGE, exchange, getTokensAllowance } from 'redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'
import './BuyTokensDialog.scss'
import BuyTokensForm from './BuyTokensForm'

function prefix (token) {
  return `components.exchange.BuyTokensDialog.${token}`
}

function mapStateToProps (state) {
  const exchangeState = state.get(DUCK_EXCHANGE)
  return {
    tokens: exchangeState.tokens(),
    usersTokens: state.get(DUCK_MAIN_WALLET).tokens(),
  }
}

const onSubmitSuccess = (buy, dispatch, props) => {
  dispatch(modalsClose())
  dispatch(exchange(props.isBuy, buy, props.exchange))
}

@connect(mapStateToProps)
export default class BuyTokensDialog extends React.PureComponent {
  static propTypes = {
    exchange: PropTypes.instanceOf(ExchangeOrderModel),
    isBuy: PropTypes.bool,
    tokens: PropTypes.instanceOf(TokensCollection),
    usersTokens: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func,
  }

  componentDidMount () {
    !this.props.isBuy && this.props.dispatch(getTokensAllowance(this.props.exchange))
  }

  render () {
    const exchangeToken = this.props.tokens.getBySymbol(this.props.exchange.symbol())
    const ethToken = this.props.usersTokens.get('ETH')

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
          <BuyTokensForm
            exchange={this.props.exchange}
            isBuy={this.props.isBuy}
            onSubmitSuccess={onSubmitSuccess}
          />
        </div>
      </ModalDialog>
    )
  }
}

