// TODO @ipavlenko: Implement a DrawerStack if there will be more than 1 drower
export const DRAWER_TOGGLE = 'drawer/TOGGLE'
export const DRAWER_HIDE = 'drawer/HIDE'

export const drawerToggle = () => (dispatch) => {
  dispatch({ type: DRAWER_TOGGLE })
}
export const drawerHide = () => (dispatch) => {
  dispatch({ type: DRAWER_HIDE })
}
