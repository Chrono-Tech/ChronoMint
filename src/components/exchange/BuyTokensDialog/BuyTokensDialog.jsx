import iconTokenDefaultSVG from 'assets/img/avaToken.svg'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { IPFSImage } from 'components'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialog from 'components/dialogs/ModalDialog'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import TokensCollection from 'models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { exchange, getTokensAllowance } from 'redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import BalancesCollection from 'models/tokens/BalancesCollection'
import TokenModel from 'models/tokens/TokenModel'
import './BuyTokensDialog.scss'
import BuyTokensForm from './BuyTokensForm'

function prefix (token) {
  return `components.exchange.BuyTokensDialog.${token}`
}

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  return {
    tokens,
    balances: state.get(DUCK_MAIN_WALLET).balances(),
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
    balances: PropTypes.instanceOf(BalancesCollection),
    dispatch: PropTypes.func,
  }

  componentDidMount () {
    !this.props.isBuy && this.props.dispatch(getTokensAllowance(this.props.exchange))
  }

  render () {
    const exchangeToken = this.props.tokens.getBySymbol(this.props.exchange.symbol())
    let userExchangeBalance = this.props.balances.item(exchangeToken.id())
    if (!userExchangeBalance) {
      userExchangeBalance = new TokenModel({})
    }
    const ethToken = this.props.tokens.item('ETH')
    const ethBalance = this.props.balances.item('ETH')

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
                      value={this.props.isBuy ? ethBalance.amount() : userExchangeBalance.amount()}
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
            exchangeToken={exchangeToken}
            exchange={this.props.exchange}
            isBuy={this.props.isBuy}
            onSubmitSuccess={onSubmitSuccess}
          />
        </div>
      </ModalDialog>
    )
  }
}

