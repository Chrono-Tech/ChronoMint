/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ApprovalNoticeModel extends abstractNoticeModel({
  amount: new BigNumber(0),
  symbol: null,
  spender: null,
}) {
  title () {
    return 'notices.approval.title'
  }

  icon () {
    return 'notices.approval.icon'
  }

  message () {
    return {
      value: 'notices.approval.message',
      amount: this.get('value'),
      symbol: this.get('symbol'),
      contractName: this.get('spender'),
    }
  }
}
