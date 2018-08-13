/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import Button from 'components/common/ui/Button/Button'
import TopButtons from 'components/common/TopButtons/TopButtons'
import { sidesOpen } from 'redux/sides/actions'
import { pendingTransactionsSelector } from '@chronobank/core/redux/mainWallet/selectors/tokens'
import { DUCK_WATCHER } from '@chronobank/core/redux/watcher/constants'
import { ethereumPendingCountSelector } from '@chronobank/core/redux/ethereum/selectors'

import { NOTIFICATION_PANEL_KEY } from 'redux/sides/constants'
import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'

import './HeaderPartial.scss'

function mapStateToProps (state) {
  const { pendingTxs } = state.get(DUCK_WATCHER)

  return {
    ethPendingTransactions: pendingTxs,
    ethereumPendingTxCount: ethereumPendingCountSelector()(state),
    btcPendingTransactions: pendingTransactionsSelector()(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleNotificationTap: () => {
      dispatch(sidesOpen({
        componentName: 'NotificationContent',
        panelKey: NOTIFICATION_PANEL_KEY,
        isOpened: true,
        className: 'notifications',
        drawerProps: {
          variant: 'temporary',
          anchor: 'right',
          width: 300,
        },
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HeaderPartial extends Component {
  static propTypes = {
    handleNotificationTap: PropTypes.func,
    ethereumPendingTxCount: PropTypes.number,
    btcPendingTransactions: PropTypes.arrayOf(PropTypes.object),
    ethPendingTransactions: PropTypes.instanceOf(Immutable.Map),
    location: PropTypes.shape({
      action: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
      pathname: PropTypes.string,
      query: PropTypes.object,
      search: PropTypes.string,
      state: PropTypes.string,
    }),
  }

  getNotificationButtonClass = () => {
    return this.props.btcPendingTransactions.length
    || this.props.ethPendingTransactions.size > 0
    || this.props.ethereumPendingTxCount > 0
      ? 'pending'
      : 'raised'
  }

  render () {
    const buttonClass = this.getNotificationButtonClass()

    return (
      <div styleName='root'>
        <div styleName='actions'>
          <TopButtons location={this.props.location} />

          <LocaleDropDown />

          <Button styleName='action' buttonType={buttonClass} onClick={this.props.handleNotificationTap}>
            <i className='material-icons'>notifications</i>
          </Button>
        </div>
      </div>
    )
  }

}
