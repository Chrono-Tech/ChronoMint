/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { I18n } from '../../utils/i18n'
import { Icons } from '../../utils/icons'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type TxModel from '../TxModel'

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
