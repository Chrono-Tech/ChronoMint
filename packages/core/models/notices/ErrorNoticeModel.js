/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ErrorNoticeModel extends abstractNoticeModel({
  message: null,
}) {
  icon () {
    return 'notices.error.icon'
  }

  title () {
    return 'notices.error.title'
  }

  details () {
    return []
  }

  message () {
    return {
      value: this.get('message'),
    }
  }
}
