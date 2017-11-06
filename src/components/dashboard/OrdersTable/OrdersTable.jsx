import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import type ExchangeOrderModel from 'models/ExchangeOrderModel'

import { modalsOpen } from 'redux/modals/actions'

import BuyTokensDialog from 'components/dialogs/BuyTokensDialog'
import TokenValue from 'components/common/TokenValue/TokenValue'

import './OrdersTable.scss'

function prefix (token) {
  return `components.dashboard.OrdersTable.${token}`
}

export class OrdersTable extends PureComponent {
  static propTypes = {
    orders: PropTypes.object,
    openDetails: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.orderIndex = 0
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='header'>
          <h3><Translate value={prefix('orderBook')} /></h3>
        </div>
        <div styleName='content'>
          <div styleName='table'>
            <div styleName='tableHead'>
              <div styleName='row'>
                <div styleName='colTrader'><Translate value={prefix('trader')} /></div>
                <div styleName='colDescription'><Translate value={prefix('paymentDescription')} /></div>
                <div styleName='colLimits'><Translate value={prefix('limits')} /></div>
                <div styleName='colActions' />
              </div>
            </div>
            <div styleName='tableBody'>
              {this.props.orders.valueSeq().map((order) => this.renderRow(order))}
            </div>
          </div>
        </div>
        {/* <div styleName='footer'>
          <RaisedButton label='All Offers' primary />
        </div> */}
      </div>
    )
  }

  renderRow (order: ExchangeOrderModel) {
    this.orderIndex++

    return (
      <div styleName='row' key={this.orderIndex}>
        <div styleName='colTrader'>ChronoBank</div>
        <div styleName='colDescription'>{order.description()}</div>
        <div styleName='colLimits'>
          <TokenValue
            value={order.limit()}
            symbol={order.symbol()}
          />
        </div>
        <div styleName='colActions'>
          <RaisedButton
            label={order.isBuy() ? 'Buy' : 'Sell'}
            disabled={order.limit().lte(0)}
            onTouchTap={(e) => {
              e.stopPropagation()
              this.props.openDetails(order)
            }}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    orders: state.get('exchange').orders,
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

