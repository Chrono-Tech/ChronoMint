/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type TxModel from '../TxModel'

export default class TransferNoticeModel extends abstractNoticeModel({
  amount: new BigNumber(0), // with decimals
  symbol: null,
  from: null, // address
  to: null, // address
  credited: false,
}) {
  tx (): TxModel {
    return this.get('tx')
  }

  icon () {
    return 'notices.transfer.icon'
  }

  title () {
    return 'notices.transfer.title'
  }

  message () {
    const isDeposited = this.get('credited')
    const value = isDeposited
      ? 'notices.transfer.receivedFrom'
      : 'notices.transfer.sentTo'
    const address = isDeposited
      ? this.get('from')
      : this.get('to')

    return {
      value,
      amount: this.get('amount'),
      symbol: this.get('symbol'),
      address,
    }
  }
}
