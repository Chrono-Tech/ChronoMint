/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import * as a from './constants'

const initialState = {
  notice: null,
  list: new Immutable.List(),
  unreadNotices: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.NOTIFIER_MESSAGE:
      return {
        ...state,
        notice: action.notice,
        list: action.isStorable ? state.list.push(action.notice) : state.list,
        unreadNotices: (state.unreadNotices || 0) + (action.isStorable ? 1 : 0),
      }
    case a.NOTIFIER_READ:
      return {
        ...state,
        unreadNotices: 0,
      }
    case a.NOTIFIER_CLOSE:
      return {
        ...state,
        notice: null,
      }
    default:
      return state
  }
}
