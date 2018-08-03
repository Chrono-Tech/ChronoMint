/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { OPERATIONS_PER_PAGE } from '../../dao/constants'
import * as a from './constants'

const initialState = {
  list: new Immutable.Map(),
  isFetching: false,
  isFetched: false,
  completedEndOfList: false,
  required: null,
  adminCount: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.OPERATIONS_FETCH:
      return {
        ...state,
        isFetching: true,
      }
    case a.OPERATIONS_LIST:
      return {
        ...state,
        list: state.isFetched ? state.list.merge(action.list) : action.list,
        isFetching: false,
        isFetched: true,
        completedEndOfList: action.list.size < OPERATIONS_PER_PAGE,
      }
    case a.OPERATIONS_SET:
      // TODO @abdulov research this
      // list: !action.operation.isDone() && (action.operation.isCancelled() || action.operation.isCompleted())
      return {
        ...state,
        list: !action.operation.isDone() && action.operation.isCompleted()
          ? state.list.delete(action.operation.originId())
          : state.list.set(action.operation.originId(), action.operation),
      }
    case a.OPERATIONS_SIGNS_REQUIRED:
      return {
        ...state,
        required: action.required,
      }
    case a.OPERATIONS_ADMIN_COUNT:
      return {
        ...state,
        adminCount: action.adminCount,
      }
    default:
      return state
  }
}
