import { I18n, ImageProvider } from 'platform'
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
    return ImageProvider.getImage('TransferNoticeModel')
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
