import PropTypes from 'prop-types'
import Immutable from 'immutable'
import { RaisedButton } from 'material-ui'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js'

import type ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import ExchangesCollection from 'models/exchange/ExchangesCollection'

import { modalsOpen } from 'redux/modals/actions'

import BuyTokensDialog from 'components/exchange/BuyTokensDialog/BuyTokensDialog'
import TokenValue from 'components/common/TokenValue/TokenValue'

import './ExchangesTable.scss'

function prefix (token) {
  return `components.exchange.OrdersTable.${token}`
}

function mapStateToProps (state) {
  const exchange = state.get('exchange')
  return {
    exchanges: exchange.exchanges(),
    filter: exchange.filter(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    openDetails: (order: ExchangeOrderModel) => dispatch(modalsOpen({
      component: BuyTokensDialog,
      props: {
        order,
      },
    })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ExchangesTable extends React.Component {
  static propTypes = {
    exchanges: PropTypes.instanceOf(ExchangesCollection),
    openDetails: PropTypes.func,
    filter: PropTypes.instanceOf(Immutable.Map),
  }

  renderRow (exchange: ExchangeOrderModel) {
    const { name: mode } = this.props.filter.get('filterMode')
    return (
      <div styleName='row' key={exchange.id()}>
        <div styleName='colTrader'>
          <span styleName='rowTitle'><Translate value={prefix('exchangeAddress')} />: </span>
          <span>{exchange.address()}</span>
        </div>
        <div styleName='colPrice'>
          <span styleName='rowTitle'><Translate value={prefix('price')} />: </span>
          <TokenValue
            value={mode === 'BUY' ? exchange.buyPrice() : exchange.sellPrice()}
            symbol={exchange.symbol()}
          />
        </div>
        <div styleName='colLimits'>
          <span styleName='rowTitle'><Translate value={prefix('limits')} />: </span>
          <TokenValue
            value={new BigNumber(0)}
            symbol={exchange.symbol()}
          />
          -
          <TokenValue
            value={mode === 'BUY' ? exchange.assetBalance() : exchange.ethBalance()}
            symbol={exchange.symbol()}
          />
        </div>
        <div styleName='colActions'>
          <RaisedButton
            label={<Translate value={prefix(mode.toLowerCase())} />}
            onTouchTap={e => {
              e.stopPropagation()
              this.props.openDetails(exchange)
            }}
          />
        </div>
      </div>
    )
  }

  render () {
    const amount = this.props.filter.get('amount')
    const filteredItems = amount > 0
      ? this.props.exchanges.items().filter((item: ExchangeOrderModel) => {
        if (this.props.filter.get('filterMode').name === 'BUY') {
          return amount < item.ethBalance()
        } else {
          return amount < item.assetBalance()
        }
      })
      : []
    return (
      <div styleName='root'>
        <div styleName='header'>
          <div styleName='title'><Translate value={prefix('orderBook')} /></div>
        </div>
        <div styleName='content'>
          <div styleName='table'>
            <div styleName='tableHead'>
              <div styleName='tableHeadRow'>
                <div styleName='colTrader'><Translate value={prefix('exchangeAddress')} /></div>
                <div styleName='colPrice'><Translate value={prefix('price')} /></div>
                <div styleName='colLimits'><Translate value={prefix('limits')} /></div>
                <div styleName='colActions' />
              </div>
            </div>
            <div styleName='tableBody'>
              {this.props.exchanges.isFetched() && filteredItems.map(exchange => this.renderRow(exchange))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


