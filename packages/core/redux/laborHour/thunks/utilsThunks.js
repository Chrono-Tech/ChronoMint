/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { notify } from '../../notifier/actions'
import ErrorNoticeModel from '../../../models/notices/ErrorNoticeModel'

// eslint-disable-next-line
export const notifyUnknownError = () => {
  notify(
    new ErrorNoticeModel({
      title: 'errors.labotHour.unknown.title',
      message: 'errors.labotHour.unknown.message',
    })
  )
}
