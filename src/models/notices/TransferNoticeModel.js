import { I18n } from 'platform/i18n'
import { Icons } from 'platform/icons'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type TxModel from '../TxModel'
import BigNumber from 'bignumber.js'

export default class TransferNoticeModel extends abstractNoticeModel({
  value: new BigNumber(0), // with decimals
  symbol: null,
  from: null, // address
  to: null, // address
  credited: false,
}) {
  tx (): TxModel {
    return this.get('tx')
  }

  icon () {
    return Icons.get('notices.transfer.icon')
  }

  title () {
    return I18n.t('notices.transfer.title')
  }

  message () {
    const isDeposited = this.get('credited')
    const message = isDeposited
      ? 'notices.transfer.receivedFrom'
      : 'notices.transfer.sentTo'
    const address = isDeposited
      ? this.get('from')
      : this.get('to')

    return I18n.t(message, {
      value: this.get('value'),
      symbol: this.get('symbol'),
      address,
    })
  }
}
