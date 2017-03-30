import {notify} from './notifier';
import LOCsManagerDAO from '../../dao/LOCsManagerDAO';

const watchInitNewLOCNotify = account => dispatch =>
  LOCsManagerDAO.watchNewLOCNotify((locNoticeModel, isOld) =>
    dispatch(notify(locNoticeModel, isOld)), account);

const watchInitRemoveLOCNotify = (account: string) => dispatch =>
  LOCsManagerDAO.watchRemoveLOCNotify((locNoticeModel, isOld) =>
    dispatch(notify(locNoticeModel, isOld)), account);

const watchInitUpdLOCStatusNotify = (account: string) => dispatch =>
  LOCsManagerDAO.watchUpdLOCStatusNotify((locNoticeModel, isOld) =>
    dispatch(notify(locNoticeModel, isOld)), account);

const watchInitUpdLOCValueNotify = (account: string) => dispatch =>
  LOCsManagerDAO.watchUpdLOCValueNotify((locNoticeModel, isOld) =>
    dispatch(notify(locNoticeModel, isOld)), account);

const watchInitUpdLOCStringNotify = (account: string) => dispatch =>
  LOCsManagerDAO.watchUpdLOCStringNotify((locNoticeModel, isOld) =>
    dispatch(notify(locNoticeModel, isOld)), account);

export {
  watchInitNewLOCNotify,
  watchInitRemoveLOCNotify,
  watchInitUpdLOCStatusNotify,
  watchInitUpdLOCValueNotify,
  watchInitUpdLOCStringNotify
}