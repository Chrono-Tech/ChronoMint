/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as types from './constants'

const initialState = {
  stack: [],
  counter: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.MODALS_OPEN:
      return {
        ...state,
        counter: state.counter + 1,
        stack: [
          ...state.stack, {
            key: state.counter,
            componentName: action.componentName,
            props: action.props,
          }
        ],
      }
    case types.MODALS_CLOSE:
      return {
        ...state,
        stack: state.stack.slice(0, -1),
      }
    case types.MODALS_REPLACE:
      return {
        ...state,
        stack: [
          ...state.stack.slice(0, -1),
          {
            key: state.counter,
            componentName: action.componentName,
            props: action.props,
          }
        ],
      }
    case types.MODALS_CLEAR:
      return {
        ...state,
        stack: [],
      }
    default:
      return state
  }
}
