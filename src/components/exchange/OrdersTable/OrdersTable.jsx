import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import type ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'

import { modalsOpen } from 'redux/modals/actions'

import BuyTokensDialog from 'components/exchange/BuyTokensDialog/BuyTokensDialog'
import TokenValue from 'components/common/TokenValue/TokenValue'

import './OrdersTable.scss'

function prefix (token) {
  return `components.exchange.OrdersTable.${token}`
}

export class OrdersTable extends React.Component {
  static propTypes = {
    orders: PropTypes.instanceOf(Immutable.List),
    openDetails: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.orderIndex = 0
  }

  renderRow (order: ExchangeOrderModel) {
    this.orderIndex++

    return (
      <div styleName='row' key={this.orderIndex}>
        <div styleName='colTrader'>
          <span styleName='rowTitle'><Translate value={prefix('trader')} />: </span>
          {order.trader()}
        </div>
        <div styleName='colPrice'>
          <span styleName='rowTitle'><Translate value={prefix('price')} />: </span>
          <TokenValue
            value={order.buyPrice()}
            symbol={order.symbol()}
          />
        </div>
        <div styleName='colLimits'>
          <span styleName='rowTitle'><Translate value={prefix('limits')} />: </span>
          <TokenValue
            value={order.limit()}
            symbol={order.symbol()}
          />
        </div>
        <div styleName='colActions'>
          <RaisedButton
            label={<Translate value={prefix(order.isBuy() ? 'buy' : 'sell')} />}
            disabled={!order.limit()}
            onTouchTap={e => {
              e.stopPropagation()
              this.props.openDetails(order)
            }}
          />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='header'>
          <div styleName='title'><Translate value={prefix('orderBook')} /></div>
        </div>
        <div styleName='content'>
          <div styleName='table'>
            <div styleName='tableHead'>
              <div styleName='tableHeadRow'>
                <div styleName='colTrader'><Translate value={prefix('trader')} /></div>
                <div styleName='colPrice'><Translate value={prefix('price')} /></div>
                <div styleName='colLimits'><Translate value={prefix('limits')} /></div>
                <div styleName='colActions' />
              </div>
            </div>
            <div styleName='tableBody'>
              {this.props.orders.valueSeq().map(order => this.renderRow(order))}
            </div>
          </div>
        </div>
        {/* <div styleName='footer'>
          <RaisedButton label='All Offers' primary />
        </div> */}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    orders: state.get('exchange').orders(),
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

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable)

