import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { RaisedButton } from 'material-ui'

import { modalsOpen } from 'redux/modals/actions'
import BuyTokensDialog from '../dialogs/BuyTokensDialog'

import './OrdersTable.scss'

export class OrdersTable extends React.Component {

  static propTypes = {
    buyTokens: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  render() {

    let data = Array(20).fill(
      { trader: 'Trader name 1', description: 'Payment description National bank transfer: Australia', min: 1000, max: 1512000, currency: 'ETH' }
    )

    return (
      <div styleName="root">
        <div styleName="header">
          <h3>Buy TIME online</h3>
        </div>
        <div styleName="content">
          <div styleName="table">
            <div styleName="tableHead">
              <div styleName="row">
                <div styleName="colTrader">Trader</div>
                <div styleName="colDescription">Payment description</div>
                <div styleName="colLimits">Limits</div>
                <div styleName="colActions"></div>
              </div>
            </div>
            <div styleName="tableBody">
              { data.map((order, index) => this.renderRow(order, index)) }
            </div>
          </div>
        </div>
        <div styleName="footer">
          <RaisedButton label="All Offers" primary={true} />
        </div>
      </div>
    )
  }

  renderRow(order, index) {

    let [min1, min2] = ('' + order.min.toFixed(2)).split('.')
    let [max1, max2] = ('' + order.max.toFixed(2)).split('.')

    return (
      <div styleName="row" key={index}>
        <div styleName="colTrader"><a href="#">{order.trader}</a></div>
        <div styleName="colDescription">{order.description}</div>
        <div styleName="colLimits">
          <span styleName="value">
            <span styleName="value1">{min1}</span>
            <span styleName="value2">.{min2}</span>
          </span>
          <span>&mdash;</span>
          <span styleName="value">
            <span styleName="value1">{max1}</span>
            <span styleName="value2">.{max2}</span>
            <span styleName="value2"> ETH</span>
          </span>
        </div>
        <div styleName="colActions">
          <RaisedButton label="Buy" onTouchTap={(e) => {
            e.stopPropagation()
            this.props.buyTokens(order)
          }} />
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    buyTokens: ({ order }) => dispatch(modalsOpen({
      component: BuyTokensDialog,
      props: {
        order
      }
    }))
  }
}

export default connect(null, mapDispatchToProps)(OrdersTable)
