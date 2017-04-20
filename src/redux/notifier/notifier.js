import { Map } from 'immutable'
import AbstractNoticeModel from '../../models/notices/AbstractNoticeModel'
import TransactionNoticeModel from '../../models/notices/TransactionNoticeModel'
import noticeFactory from '../../models/notices/factory'
import localStorageKeys from '../../constants/localStorageKeys'
import ls from 'local-storage'

export const NOTIFIER_MESSAGE = 'notifier/MESSAGE'
export const NOTIFIER_CLOSE = 'notifier/CLOSE'
export const NOTIFIER_LIST = 'notifier/LIST'

const initialState = {
  notice: null,
  list: new Map()
}

const reducer = (state = initialState, action) => {
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

const retrieveNotices = () => {
  let notices = null
  try {
    notices = ls(localStorageKeys.NOTICES)
  } catch (e) {
  }
  if (!Array.isArray(notices)) notices = []
  return notices
}

const listNotices = (data = null) => (dispatch) => {
  let notices = data === null ? retrieveNotices() : data
  let list = new Map()
  for (let i in notices) {
    if (notices.hasOwnProperty(i)) {
      const notice:AbstractNoticeModel = noticeFactory(notices[i].name, notices[i].data)
      list = list.set(notice.id(), notice)
    }
  }
  dispatch({type: NOTIFIER_LIST, list})
}

const saveNotice = (notice: AbstractNoticeModel) => (dispatch) => {
  let notices = retrieveNotices()
  notices.unshift({
    name: notice.constructor.name,
    data: notice.toJS()
  })
  ls(localStorageKeys.NOTICES, notices)
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

export default reducer
