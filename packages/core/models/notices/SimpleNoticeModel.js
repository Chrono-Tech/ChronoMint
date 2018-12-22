/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractNoticeModel } from './AbstractNoticeModel'

export default class SimpleNoticeModel extends abstractNoticeModel({
  icon: null,
  title: null,
  message: '',
  params: {},
}) {
  icon () {
    return this.get('icon') || 'notices.transfer.icon'
  }

  title () {
    return this.get('title') || 'notices.transfer.icon'
  }

  message () {
    return {
      value: this.get('message'),
      ...this.get('params'),
    }
  }
}
