/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import CBEModel from '../../../../models/CBEModel'
import * as a from './constants'

const initialState = {
  list: new Immutable.Map(),
  selected: new CBEModel(),
  isFetched: false,
  isLoading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.CBE_LIST:
      return {
        ...state,
        list: action.list,
        isFetching: false,
        isFetched: true,
      }
    case a.CBE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case a.CBE_FORM:
      return {
        ...state,
        selected: action.cbe,
      }
    case a.CBE_SET:
      return {
        ...state,
        list: state.list.set(action.cbe.address(), action.cbe),
      }
    case a.CBE_REMOVE:
      return {
        ...state,
        list: state.list.delete(action.cbe.address()),
      }
    default:
      return state
  }
}
