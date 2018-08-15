/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from '@chronobank/core-dependencies/i18n'
import { Icons } from '@chronobank/core-dependencies/icons'
import type PollDetailsModel from '../PollDetailsModel'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class PollNoticeModel extends abstractNoticeModel({
  pollId: null,
  poll: null,
  status: null,
  transactionHash: null,
}) {
  icon () {
    return Icons.get('notices.polls.icon')
  }

  title () {
    return I18n.t('notices.polls.title')
  }

  status () {
    return this.get('status')
  }

  transactionHash (hash) {
    if (hash !== undefined) {
      return this.set('transactionHash', hash)
    }
    return this.get('transactionHash')
  }

  pollId () {
    return this.get('pollId')
  }

  poll (value): PollDetailsModel {
    return this._getSet('poll', value)
  }

  message () {
    const message = `notices.polls.${this.get('status')}`
    return I18n.t(message)
  }
}
