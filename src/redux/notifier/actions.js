import type AbstractNoticeModel from '../../models/notices/AbstractNoticeModel'

export const NOTIFIER_MESSAGE = 'notifier/MESSAGE'
export const NOTIFIER_READ = 'notifier/READ'
export const NOTIFIER_CLOSE = 'notifier/CLOSE'

const notify = (notice: AbstractNoticeModel, isStorable = true) => ({type: NOTIFIER_MESSAGE, notice, isStorable})
const readNotices = () => ({type: NOTIFIER_READ})
const closeNotifier = () => ({type: NOTIFIER_CLOSE})

export {
  notify,
  readNotices,
  closeNotifier
}
