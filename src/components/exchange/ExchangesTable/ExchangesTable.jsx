import BigNumber from 'bignumber.js'
import TokenValue from 'components/common/TokenValue/TokenValue'

import BuyTokensDialog from 'components/exchange/BuyTokensDialog/BuyTokensDialog'
import Immutable from 'immutable'
import { RaisedButton } from 'material-ui'

import type ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import ExchangesCollection from 'models/exchange/ExchangesCollection'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import { modalsOpen } from 'redux/modals/actions'

import './ExchangesTable.scss'

function prefix (token) {
  return `components.exchange.OrdersTable.${token}`
}

function mapStateToProps (state) {
  const exchange = state.get('exchange')
  return {
    exchanges: exchange.exchanges(),
    showFilter: exchange.showFilter(),
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
    showFilter: PropTypes.bool,
  }

  renderRow (exchange: ExchangeOrderModel) {
    const filterMode = this.props.filter.get('filterMode')
    let showBuy = true
    let showSell = true
    if (filterMode) {
      showBuy = filterMode.name === 'BUY'
      showSell = filterMode.name === 'SELL'
    }
    return (
      <div styleName='row' key={exchange.id()}>
        <div styleName='colTrader'>
          <span styleName='rowTitle'><Translate value={prefix('exchangeAddress')} />: </span>
          <span styleName='ellipsis'>{exchange.address()}</span>
        </div>
        <div styleName='colPrice'>
          {showBuy &&
          <div>
            <span styleName='rowTitle'><Translate value={prefix('buyPrice')} />: </span>
            <TokenValue value={exchange.buyPrice()} symbol={exchange.symbol()} />
          </div>
          }
          {showSell &&
          <div>
            <span styleName='rowTitle'><Translate value={prefix('sellPrice')} />: </span>
            <TokenValue
              value={exchange.sellPrice()}
              symbol={exchange.symbol()}
            />
          </div>
          }
        </div>
        <div styleName='colLimits'>
          {showBuy &&
          <div>
            <span styleName='rowTitle'><Translate value={prefix('buyLimits')} />: </span>
            <TokenValue
              value={new BigNumber(0)}
              symbol={exchange.symbol()}
            />
            -
            <TokenValue
              value={exchange.assetBalance()}
              symbol={exchange.symbol()}
            />
          </div>
          }
          {showSell &&
          <div>
            <span styleName='rowTitle'><Translate value={prefix('sellLimits')} />: </span>
            <TokenValue
              value={new BigNumber(0)}
              symbol={exchange.symbol()}
            />
            -
            <TokenValue
              value={exchange.ethBalance()}
              symbol={exchange.symbol()}
            />
          </div>
          }
        </div>
        <div styleName='colActions'>
          {showBuy &&
          <RaisedButton
            label={<Translate value={prefix('buy')} />}
            onTouchTap={e => {
              e.stopPropagation()
              this.props.openDetails(exchange)
            }}
          />
          }
          {showSell &&
          <RaisedButton
            label={<Translate value={prefix('sell')} />}
            onTouchTap={e => {
              e.stopPropagation()
              this.props.openDetails(exchange)
            }}
          />
          }
        </div>
      </div>
    )
  }

  render () {
    const amount = this.props.filter.get('amount')
    let filteredItems
    if (this.props.showFilter) {
      filteredItems = amount > 0
        ? this.props.exchanges.items().filter((item: ExchangeOrderModel) => {
          if (this.props.filter.get('filterMode').name === 'BUY') {
            return amount < item.ethBalance()
          } else {
            return amount < item.assetBalance()
          }
        })
        : []
    } else {
      filteredItems = this.props.exchanges.items()
    }
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
              {this.props.exchanges.isFetched() && filteredItems.map((exchange) => this.renderRow(exchange))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


