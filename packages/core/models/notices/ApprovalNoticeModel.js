/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from '@chronobank/core-dependencies/i18n'
import { Icons } from '@chronobank/core-dependencies/icons'
import BigNumber from 'bignumber.js'

import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ApprovalNoticeModel extends abstractNoticeModel({
  value: new BigNumber(0),
  symbol: null,
  spender: null,
}) {
  title () {
    return I18n.t('notices.approval.title')
  }

  icon () {
    return Icons.get('notices.approval.icon')
  }

  message () {
    return I18n.t('notices.approval.message', {
      value: this.get('value'),
      symbol: this.get('symbol'),
      contractName: this.get('spender'),
    })
  }
}
