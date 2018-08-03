/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type AbstractNoticeModel from '../../models/notices/AbstractNoticeModel'
import ErrorNoticeModel from '../../models/notices/ErrorNoticeModel'
import {
  // DUCK_NOTIFIER,
  NOTIFIER_CLOSE,
  NOTIFIER_MESSAGE,
  NOTIFIER_READ,
} from './constants'

export const notify = (notice: AbstractNoticeModel, isStorable = true) => ({
  type: NOTIFIER_MESSAGE,
  notice,
  isStorable,
})
export const readNotices = () => ({ type: NOTIFIER_READ })
export const closeNotifier = () => ({ type: NOTIFIER_CLOSE })

export const notifyError = (e: Error, invoker: string = '') => (dispatch) => {
  // eslint-disable-next-line
  console.error(`${invoker} error`, e.message)
  dispatch(notify(new ErrorNoticeModel({
    message: e.message,
  })))
}
