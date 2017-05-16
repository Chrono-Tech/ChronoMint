import { Map } from 'immutable'
import AbstractNoticeModel from '../../models/notices/AbstractNoticeModel'
import TransactionNoticeModel from '../../models/notices/TransactionNoticeModel'
import noticeFactory from '../../models/notices/factory'
import LS from '../../dao/LocalStorageDAO'

export const NOTIFIER_MESSAGE = 'notifier/MESSAGE'
export const NOTIFIER_CLOSE = 'notifier/CLOSE'
export const NOTIFIER_LIST = 'notifier/LIST'

const initialState = {
  notice: null,
  list: new Map()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFIER_MESSAGE:
      return {
        ...state,
        notice: action.notice
      }
    case NOTIFIER_LIST:
      return {
        ...state,
        list: action.list
      }
    case NOTIFIER_CLOSE:
      return {
        ...state,
        notice: null
      }
    default:
      return state
  }
}

const listNotices = (data = null) => (dispatch) => {
  let notices = data === null ? LS.getNotices() : data
  let list = new Map()
  for (let i in notices) {
    if (notices.hasOwnProperty(i)) {
      const notice: AbstractNoticeModel = noticeFactory(notices[i].name, notices[i].data)
      list = list.set(notice.id(), notice)
    }
  }
  dispatch({type: NOTIFIER_LIST, list})
}

const saveNotice = (notice: AbstractNoticeModel) => (dispatch) => {
  let notices = LS.getNotices()
  notices.unshift({
    name: notice.constructor.name,
    data: notice.toJS()
  })
  LS.setNotices(notices)
  dispatch(listNotices(notices)) // TODO Don't list notices again - just add one new to state
}

const notify = (notice: AbstractNoticeModel, onlySave = false) => (dispatch) => {
  if (!onlySave) {
    dispatch({type: NOTIFIER_MESSAGE, notice})
  }
  dispatch(saveNotice(notice))
}

const transactionStart = () => ({type: NOTIFIER_MESSAGE, notice: new TransactionNoticeModel()})
const closeNotifier = () => ({type: NOTIFIER_CLOSE})

export {
  notify,
  closeNotifier,
  listNotices,
  transactionStart
}
