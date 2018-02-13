import * as actions from './actions'

const initialState = {
  stack: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SIDES_PUSH:
      return {
        ...state,
        stack: [...state.stack, {
          key: action.key,
          component: action.component,
          props: action.props,
        }],
      }
    case actions.SIDES_POP:
      return {
        ...state,
        stack: state.stack.filter((panel) => panel.key !== action.key),
      }
    case actions.SIDES_CLEAR:
      return {
        ...state,
        stack: [],
      }
    default:
      return state
  }
}
