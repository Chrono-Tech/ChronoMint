/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as actions from './constants'

const initialState = {
  stack: [],
  counter: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.MODALS_PUSH:
      return {
        ...state,
        counter: state.counter + 1,
        stack: [...state.stack, {
          key: state.counter,
          component: action.component,
          props: action.props,
        }],
      }
    case actions.MODALS_POP:
      return {
        ...state,
        stack: state.stack.slice(0, -1),
      }
    case actions.MODALS_REPLACE:
      return {
        ...state,
        stack: [...state.stack.slice(0, -1), {
          key: state.counter,
          component: action.component,
          props: action.props,
        }],
      }
    case actions.MODALS_CLEAR:
      return {
        ...state,
        stack: [],
      }
    default:
      return state
  }
}
