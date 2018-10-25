/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ErrorNoticeModel extends abstractNoticeModel({
  message: null,
  params: {},
}) {
  icon () {
    return this.get('icon') || 'notices.error.icon'
  }

  title () {
    return this.get('title') || 'notices.error.title'
  }

  details () {
    return []
  }

  message () {
    return {
      value: this.get('message'),
      ...this.get('params'),
    }
  }
}
