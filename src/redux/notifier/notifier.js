import Immutable from 'immutable'
import AbstractNoticeModel from '../../models/notices/AbstractNoticeModel'

export const NOTIFIER_MESSAGE = 'notifier/MESSAGE'
export const NOTIFIER_CLOSE = 'notifier/CLOSE'

const initialState = {
  notice: null,
  list: new Immutable.List()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFIER_MESSAGE:
      return {
        ...state,
        notice: action.notice,
        list: action.isStorable ? state.list.push(action.notice) : state.list
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

const notify = (notice: AbstractNoticeModel, isStorable = true) => ({type: NOTIFIER_MESSAGE, notice, isStorable})
const closeNotifier = () => ({type: NOTIFIER_CLOSE})

export {
  notify,
  closeNotifier
}
