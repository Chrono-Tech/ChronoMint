import { connect } from "react-redux"
import React, { PureComponent } from 'react'

import ReceivedTransactionSVG from 'assets/img/r-0.svg'

import './NotificationContent.scss'

export const PANEL_KEY = 'NotificationContent_panelKey'

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class NotificationContent extends PureComponent {

  static propTypes = {
  }

  static defaultProps = {
  }

  renderTransaction = (tr) => {

  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='section-header'>
          Current transactions
        </div>
        <div styleName='tr-list'>
          <div styleName='tr-container'>
            <div styleName='tr-icon'>
              <img width={40} height={40} src={ReceivedTransactionSVG} />
            </div>
            <div styleName='tr-info'>
              <div styleName='tr-info-title'>Receiving from</div>
              <div styleName='tr-info-message'>1Q1p...6nK9</div>
            </div>
            <div styleName='tr-amount'>
              Amount
              + BTC 1.00
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NotificationContent
