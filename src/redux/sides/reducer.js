import { ProfileSidePanel } from 'layouts/partials'
import { PROFILE_SIDE_PANEL_KEY } from 'layouts/partials/ProfileSidePanel/ProfileSidePanel'
import * as actions from './actions'

const initialState = {
  isProfilePanelOpen: false,
  stack: [{
    component: ProfileSidePanel,
    key: PROFILE_SIDE_PANEL_KEY,
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
    case actions.SIDES_OPEN_PROFILE_PANEL:
      return {
        ...state,
        isProfilePanelOpen: true,
      }
    case actions.SIDES_CLOSE_PROFILE_PANEL:
      return {
        ...state,
        isProfilePanelOpen: false,
      }
    default:
      return state
  }
}
