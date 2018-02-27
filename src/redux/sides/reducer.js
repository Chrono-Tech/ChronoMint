import { SidePanel } from 'layouts/partials'
import { SIDE_PANEL_KEY } from 'layouts/partials/SidePanel/SidePanel'
import * as actions from './actions'

const initialState = {
  isProfilePanelOpen: false,
  stack: [{
    component: SidePanel,
    key: SIDE_PANEL_KEY,
    props: { isOpened: false },
  }],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SIDES_PUSH:
      const filteredStack = state.stack.filter((panel) => panel.key !== action.key)
      return {
        ...state,
        stack: [...filteredStack, {
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
