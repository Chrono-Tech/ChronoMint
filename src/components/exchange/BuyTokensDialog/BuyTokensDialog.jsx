/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import iconTokenDefaultSVG from 'assets/img/avaToken.svg'
import { IPFSImage } from 'components'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialog from 'components/dialogs/ModalDialog'
import ExchangeOrderModel from '@chronobank/core/models/exchange/ExchangeOrderModel'
import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { exchange, getTokensAllowance } from '@chronobank/core/redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/actions'
import Amount from '@chronobank/core/models/Amount'
import BalancesCollection from '@chronobank/core/models/tokens/BalancesCollection'
import BalanceModel from '@chronobank/core/models/tokens/BalanceModel'
import './BuyTokensDialog.scss'
import BuyTokensForm from './BuyTokensForm'
import { getMainEthWallet } from '../../../../packages/core/redux/wallets/selectors/models'

function prefix (token) {
  return `components.exchange.BuyTokensDialog.${token}`
}

function mapStateToProps (state) {
  const tokens = state.get(DUCK_TOKENS)
  const wallet = getMainEthWallet(state)
  return {
    tokens,
    balances: wallet.balances,
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
    const exchangeToken = this.props.tokens.item(this.props.exchange.symbol())
    let userExchangeBalance = this.props.balances.item(exchangeToken.id())
    if (!userExchangeBalance) {
      userExchangeBalance = new BalanceModel({ amount: new Amount(0, exchangeToken.symbol()) })
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

