import { I18n } from 'react-redux-i18n'
import React from 'react'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type TxModel from '../TxModel'

export default class TransferNoticeModel extends abstractNoticeModel({
  tx: null,
  account: null,
}) {
  tx (): TxModel {
    return this.get('tx')
  }

  icon () {
    return (<i className='material-icons'>account_balance_wallet</i>)
  }

  title () {
    return I18n.t('notices.transfer.title')
  }

  message () {
    return this.tx().credited
      ? I18n.t('notices.transfer.receivedFrom', {
        value: this.tx().value().toString(10),
        symbol: this.tx().symbol(),
        address: this.tx().from(),
      })
      : I18n.t('notices.transfer.sentTo', {
        value: this.tx().value().toString(10),
        symbol: this.tx().symbol(),
        address: this.tx().to(),
      })
  }
}
