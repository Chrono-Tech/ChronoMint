/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import classnames from 'classnames'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { DUCK_WATCHER } from '@chronobank/core/redux/watcher/actions'
import { DUCK_NOTIFIER } from '@chronobank/core/redux/notifier/actions'
import TxExecModel from '@chronobank/core/models/TxExecModel'
import TxModel from '@chronobank/core/models/TxModel'
import CurrentTransactionNotificationModel from '@chronobank/core/models/CurrentTransactionNotificationModel'
import { pendingTransactionsSelector } from '@chronobank/core/redux/mainWallet/selectors/tokens'
import Immutable from 'immutable'
import { connect } from "react-redux"
import React, { PureComponent } from 'react'
import ReceivedTransactionSVG from 'assets/img/r-0.svg'
import Value from 'components/common/Value/Value'
import AbstractNoticeModel from '@chronobank/core/models/notices/AbstractNoticeModel'
import Moment from 'components/common/Moment'
import { FULL_DATE } from '@chronobank/core/models/constants'
import { IconButton } from 'material-ui'
import { SIDES_CLOSE_ALL } from 'redux/sides/actions'
import { prefix } from './lang'
import './NotificationContent.scss'

export const NOTIFICATION_PANEL_KEY = 'NotificationContent_panelKey'

function mapStateToProps (state) {
  const { pendingTxs } = state.get(DUCK_WATCHER)
  const { list } = state.get(DUCK_NOTIFIER)
  const btcTransactions = pendingTransactionsSelector()(state)

  return {
    noticesList: list,
    ethTransactionsList: pendingTxs,
    btcTransactionsList: btcTransactions,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch({ type: SIDES_CLOSE_ALL }),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class NotificationContent extends PureComponent {
  static propTypes = {
    ethTransactionsList: PropTypes.instanceOf(Immutable.Map),
    btcTransactionsList: PropTypes.arrayOf(TxModel),
    noticesList: PropTypes.instanceOf(Immutable.List),
    onClose: PropTypes.func,
  }

  handleClose = () => {
    this.props.onClose()
  }

  getCurrentTransactionNotificationList = () => {
    const { ethTransactionsList, btcTransactionsList } = this.props
    const list = []

    ethTransactionsList.map((item) => {
      list.push(this.convertToCurrentTransactionNotification(item))
    })
    btcTransactionsList.map((item) => {
      console.log('btcPendingTransactions: ', item, item.toJSON())
      list.push(this.convertToCurrentTransactionNotification(item))
    })

    return list
  }

  convertToCurrentTransactionNotification (transaction) {

    switch (true) {

      // Eth transactions
      case transaction instanceof TxExecModel:
        console.log('transaction instanceof TxExecModel: ', transaction, transaction.toJSON())
        return new CurrentTransactionNotificationModel({
          id: transaction.hash(),
          title: transaction.title(),
          date: transaction.time(),
          details: transaction.details(),
        })

      // BTC transactions
      case transaction instanceof TxModel:
        console.log('transaction instanceof TxExecModel: ', transaction, transaction.toJSON())
        return new CurrentTransactionNotificationModel({
          id: transaction.txHash(),
          title: `${transaction.symbol()} Transfer`,
          date: transaction.time(),
          details: transaction.details(),
        })

      default:
        console.log('Transactions default: ', transaction)
        break

    }

  }

  renderTransaction (notification: CurrentTransactionNotificationModel) {

    const hash = notification.hash
    const details = notification.details

    return (
      <div key={notification.id} styleName='tableItem'>
        <div styleName='itemLeft'>
          <img alt='' src={ReceivedTransactionSVG} />
        </div>
        <div styleName='itemInfo'>
          <div styleName='infoRow'>
            <div styleName='infoTitle'>{notification.title}</div>
            {hash && <div styleName='info-address'>{hash}</div>}
          </div>
          {details && details.map((item, index) => {
            console.log('details && details.map((item, index): ', item)
            return (
              <div key={index} styleName='infoRow'>
                <div styleName='infoLabel'>{item.label}:</div>
                <div styleName='infoValue'><Value value={item.value} /></div>
              </div>
            )
          })}
        </div>
        <div styleName='itemRight' />
      </div>
    )
  }

  renderNotice (notice: AbstractNoticeModel) {
    const details = notice.details()

    return (
      <div key={notice.id()} styleName='tableItem'>
        <div styleName={classnames('itemLeft', { 'error': !!notice.error })}>
          {notice.icon()}
        </div>
        <div styleName='itemInfo'>
          <div styleName='infoRow'>
            <div styleName='infoTitle'>{notice.title()}</div>
          </div>
          <div styleName='infoRow'>
            <div styleName='infoLabel'>{notice.message()}</div>
          </div>
          {details && details.map((item, index) => (
            <div key={index} styleName='infoRow'>
              <div styleName='infoLabel'>{item.label}:</div>
              &nbsp;
              <div styleName='infoValue'><Value value={item.value} /></div>
            </div>
          ))}
          <div styleName='infoRow'>
            <div styleName='infoDatetime'><Moment date={notice.date()} format={FULL_DATE} /></div>
          </div>
        </div>
      </div>
    )
  }

  render () {

    const transactionsList = this.getCurrentTransactionNotificationList()
    console.log('transactionsList: ', transactionsList)
    // const transactionsList = this.props.ethTransactionsList.valueSeq().sortBy((n) => n.time()).reverse()
    const noticesList = this.props.noticesList.valueSeq().sortBy((n) => n.time()).reverse()

    return (
      <div styleName='root'>
        <div>
          <div styleName='section-header'>
            <div styleName='title'><Translate value={`${prefix}.currentTransactions`} /></div>
            <div styleName='close' onClick={this.handleClose}>
              <IconButton>
                <i className='material-icons'>close</i>
              </IconButton>
            </div>
          </div>
          {!transactionsList.length
            ? (<div styleName='tableItem'><Translate value={`${prefix}.noTransactions`} /></div>)
            : transactionsList.map((item) => this.renderTransaction(item))
          }

          <div styleName='section-header'>
            <Translate value={`${prefix}.systemNotifications`} />
          </div>

          {noticesList.isEmpty()
            ? (<div styleName='tableItem'><Translate value={`${prefix}.noNotices`} /></div>)
            : noticesList.map((item) => this.renderNotice(item))
          }
        </div>
      </div>
    )
  }
}

export default NotificationContent
