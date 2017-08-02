import * as actions from './actions'

const initialState = {
  stack: [],
  counter: 0
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
          props: action.props
        }]
      }
    case actions.MODALS_POP:
      return {
        ...state,
        stack: state.stack.slice(0, -1)
      }
    case actions.MODALS_REPLACE:
      return {
        ...state,
        stack: [...state.stack.slice(0, -1), {
          key: state.counter,
          component: action.component,
          props: action.props
        }]
      }
    case actions.MODALS_CLEAR:
      return {
        ...state,
        stack: []
      }
    default:
      return state
  }
}
