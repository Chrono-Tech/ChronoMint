import { notify } from './notifier'
import LOCsManagerDAO from '../../dao/LOCsManagerDAO'

// TODO Move out this action creators into the LOC duck

const watchInitNewLOCNotify = () => dispatch =>
  LOCsManagerDAO.watchNewLOCNotify((locNoticeModel, isOld) => dispatch(notify(locNoticeModel, isOld)))

const watchInitRemoveLOCNotify = () => dispatch =>
  LOCsManagerDAO.watchRemoveLOCNotify((locNoticeModel, isOld) => dispatch(notify(locNoticeModel, isOld)))

const watchInitUpdLOCStatusNotify = () => dispatch =>
  LOCsManagerDAO.watchUpdLOCStatusNotify((locNoticeModel, isOld) => dispatch(notify(locNoticeModel, isOld)))

const watchInitUpdLOCValueNotify = () => dispatch =>
  LOCsManagerDAO.watchUpdLOCValueNotify((locNoticeModel, isOld) => dispatch(notify(locNoticeModel, isOld)))

const watchInitUpdLOCStringNotify = () => dispatch =>
  LOCsManagerDAO.watchUpdLOCStringNotify((locNoticeModel, isOld) => dispatch(notify(locNoticeModel, isOld)))

export {
  watchInitNewLOCNotify,
  watchInitRemoveLOCNotify,
  watchInitUpdLOCStatusNotify,
  watchInitUpdLOCValueNotify,
  watchInitUpdLOCStringNotify
}
