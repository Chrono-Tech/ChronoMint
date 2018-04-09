/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from 'platform/i18n'
import { Icons } from 'platform/icons'
import { abstractNoticeModel } from './AbstractNoticeModel'

export default class ErrorNoticeModel extends abstractNoticeModel({
  message: null,
}) {
  icon () {
    return Icons.get('notices.error.icon')
  }

  title () {
    return I18n.t('notices.error.title')
  }

  details () {
    return []
  }

  message () {
    return this.get('message')
  }
}
