import { PROFILE_SIDE_PANEL_KEY } from 'components/common/SideStack/SideStack'
import ProfileContent from 'layouts/partials/ProfileContent/ProfileContent'
import MenuTokenMoreInfo, { MENU_TOKEN_MORE_INFO_PANEL_KEY } from 'layouts/partials/DrawerMainMenu/MenuTokenMoreInfo/MenuTokenMoreInfo'
import NotificationContent, { NOTIFICATION_PANEL_KEY } from 'layouts/partials/NotificationContent/NotificationContent'
import * as actions from './actions'

const initialState = {
  isProfilePanelOpen: false,
  stack: {
    [ PROFILE_SIDE_PANEL_KEY ]: {
      component: ProfileContent,
      panelKey: PROFILE_SIDE_PANEL_KEY,
      isOpened: false,
      direction: 'right',
      drawerProps: {
        containerStyle: {
          width: '300px',
        },
        width: 300,
      },
    },
    [ NOTIFICATION_PANEL_KEY ]: {
      component: NotificationContent,
      panelKey: NOTIFICATION_PANEL_KEY,
      isOpened: false,
      direction: 'right',
    },
    [ MENU_TOKEN_MORE_INFO_PANEL_KEY ]: {
      component: MenuTokenMoreInfo,
      panelKey: MENU_TOKEN_MORE_INFO_PANEL_KEY,
      isOpened: false,
      direction: 'left',
    },
  },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SIDES_PUSH:
      return {
        ...state,
        stack: {
          ...state.stack,
          [ action.panelKey ]: {
            panelKey: action.panelKey,
            component: action.component,
            componentProps: action.componentProps,
            isOpened: action.isOpened,
            direction: action.direction,
            drawerProps: action.drawerProps,
            preCloseAction: action.preCloseAction,
          },
        },
      }
    case actions.SIDES_TOGGLE:
      return {
        ...state,
        stack: {
          ...state.stack,
          [ action.panelKey ]: {
            ...state.stack[ action.panelKey ],
            isOpened: action.isOpened,
          },
        },
      }
    case actions.SIDES_CLOSE_ALL:
      let newStackToClose = { ...state.stack }
      Object.keys(state.stack).map((key) => {
        newStackToClose[ key ].isOpened = false
      })
      return {
        ...state,
        stack: {
          ...newStackToClose,
        },
      }
    case actions.SIDES_POP:
      let newStack = { ...state.stack }
      delete newStack[ action.panelKey ]

      return {
        ...state,
        stack: { ...newStack },
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
