/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type PollDetailsModel from '../PollDetailsModel'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class PollNoticeModel extends abstractNoticeModel({
  pollId: null,
  poll: null,
  status: null,
  transactionHash: null,
}) {
  icon () {
    return 'notices.polls.icon'
  }

  title () {
    return 'notices.polls.title'
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
    return {
      value: `notices.polls.${this.get('status')}`,
    }
  }
}
