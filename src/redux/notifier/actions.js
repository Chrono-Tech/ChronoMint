import type AbstractNoticeModel from 'models/notices/AbstractNoticeModel'
import ErrorNoticeModel from 'models/notices/ErrorNoticeModel'

export const NOTIFIER_MESSAGE = 'notifier/MESSAGE'
export const NOTIFIER_READ = 'notifier/READ'
export const NOTIFIER_CLOSE = 'notifier/CLOSE'

export const DUCK_NOTIFIER = 'notifier'

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
