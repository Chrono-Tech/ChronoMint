/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractNoticeModel from '@chronobank/core/models/notices/AbstractNoticeModel'
import classnames from 'classnames'
import CurrentTransactionNotificationModel from '@chronobank/core/models/CurrentTransactionNotificationModel'
import { pendingTransactionsSelector as btcPendingTransactionsSelector } from '@chronobank/core/redux/wallets/selectors/tokens'
import Immutable from 'immutable'
import Moment from 'components/common/Moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import ReceivedTransactionSVG from 'assets/img/r-0.svg'
import TxEntryModel from '@chronobank/core/models/TxEntryModel'
import TxExecModel from '@chronobank/core/models/TxExecModel'
import TxModel from '@chronobank/core/models/TxModel'
import Value from 'components/common/Value/Value'
import { connect } from 'react-redux'
import { DUCK_NOTIFIER } from '@chronobank/core/redux/notifier/constants'
import { DUCK_WATCHER } from '@chronobank/core/redux/watcher/constants'
import { eosPendingFormatSelector } from '@chronobank/core/redux/eos/selectors/mainSelectors'
import { pendingTransactionsSelector } from '@chronobank/core/redux/transaction/selectors'
import { FULL_DATE } from '@chronobank/core/models/constants'
import { IconButton } from '@material-ui/core'
import { Icons } from 'components/icons'
import { sidesCloseAll } from 'redux/sides/actions'
import TxDescModel from '@chronobank/core/models/TxDescModel'
import { Translate } from 'react-redux-i18n'
import './NotificationContent.scss'
import { prefix } from './lang'

function mapStateToProps (state) {
  const { pendingTxs } = state.get(DUCK_WATCHER)
  const { list } = state.get(DUCK_NOTIFIER)
  const btcTransactions = btcPendingTransactionsSelector()(state)
  const ethereumTxList = pendingTransactionsSelector()(state)
  const eosTxList = eosPendingFormatSelector()(state)

  return {
    noticesList: list,
    ethTransactionsList: pendingTxs,
    btcTransactionsList: btcTransactions,
    ethereumTxList,
    eosTxList,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(sidesCloseAll()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class NotificationContent extends PureComponent {
  static propTypes = {
    ethTransactionsList: PropTypes.instanceOf(Immutable.Map),
    btcTransactionsList: PropTypes.arrayOf(PropTypes.object),
    noticesList: PropTypes.instanceOf(Immutable.List),
    onClose: PropTypes.func,
  }

  handleClose = () => {
    this.props.onClose()
  }

  getCurrentTransactionNotificationList = () => {
    const { ethTransactionsList, btcTransactionsList, ethereumTxList, eosTxList } = this.props
    const list = []

    ethereumTxList
      .map((item) => {
        list.push(this.convertToCurrentTransactionNotification(item))
      })
    ethTransactionsList.forEach((item) => {
      list.push(this.convertToCurrentTransactionNotification(item))
    })
    btcTransactionsList.forEach((item) => {
      list.push(this.convertToCurrentTransactionNotification(item))
    })
    eosTxList
      .map((item) => {
        list.push(this.convertToCurrentTransactionNotification(item))
      })

    return list
  }

  convertToCurrentTransactionNotification (transaction) {
    switch (true) {
    // Eth transactions
    case transaction instanceof TxExecModel:
      return new CurrentTransactionNotificationModel({
        id: transaction.id(),
        hash: transaction.hash,
        title: transaction.title(),
        date: transaction.time,
        details: transaction.details(),
      })

      // BTC transactions
    case transaction instanceof TxModel:
      return new CurrentTransactionNotificationModel({
        id: transaction.txHash(),
        hash: transaction.txHash(),
        title: `${transaction.symbol()} Transfer`,
        date: transaction.time(),
        details: transaction.details(),
      })

    case transaction instanceof TxDescModel:
      return new CurrentTransactionNotificationModel({
        id: transaction.hash,
        hash: transaction.hash,
        title: `${transaction.value.symbol()} Transfer`,
        date: transaction.time,
        details: transaction.details,
      })

    case transaction instanceof CurrentTransactionNotificationModel:
      return transaction

    case transaction instanceof TxEntryModel:
      //TODO change to describer
      return new CurrentTransactionNotificationModel({
        id: transaction.key,
        hash: transaction.hash || <Translate value={`${prefix}.pending`} />,
        title: <Translate value={`${prefix}.newTx`} />,
        date: transaction.tx.time,
        details: [
          { label: 'From', value: transaction.tx.from },
          { label: 'To', value: transaction.tx.to },
        ],
      })
    default:
      break
    }

  }

  renderTransaction (notification: CurrentTransactionNotificationModel) {
    const {
      hash,
      details,
      id,
      title,
    } = notification

    return (
      <div key={id} styleName='tableItem'>
        <div styleName='itemLeft'>
          <img alt='' src={ReceivedTransactionSVG} />
        </div>
        <div styleName='itemInfo'>
          <div styleName='infoRow'>
            <div styleName='infoTitle'>{title}</div>
          </div>
          <div styleName='infoRow'>
            <div styleName='infoLabel'><Translate value={`${prefix}.hash`} /></div>
            {hash && <div styleName='infoValue'>{hash}</div>}
          </div>
          {details && details.map((item, index) => {
            return (
              <div key={index} styleName='infoRow'>
                <div styleName='infoLabel'><Translate value={item.label} />:</div>
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
          {Icons.get(notice.icon())}
        </div>
        <div styleName='itemInfo'>
          <div styleName='infoRow'>
            <Translate
              styleName='infoTitle'
              value={notice.title()}
            />
          </div>
          <div styleName='infoRow'>
            <Translate
              styleName='infoTitle'
              {...notice.message()}
            />
          </div>
          {details && details.map((item, index) => (
            <div key={index} styleName='infoRow'>
              <div styleName='infoLabel'><Translate value={item.label} />:</div>
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
            ? (<div styleName='tableItem'><Translate styleName='nothing' value={`${prefix}.noTransactions`} /></div>)
            : transactionsList.map((item) => this.renderTransaction(item))
          }

          <div styleName='section-header'>
            <Translate value={`${prefix}.systemNotifications`} />
          </div>

          {noticesList.isEmpty()
            ? (<div styleName='tableItem'><Translate styleName='nothing' value={`${prefix}.noNotices`} /></div>)
            : noticesList.map((item) => this.renderNotice(item))
          }
        </div>
      </div>
    )
  }
}

export default NotificationContent
