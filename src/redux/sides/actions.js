export const SIDES_PUSH = 'sides/PUSH'
export const SIDES_POP = 'sides/POP'
export const SIDES_CLEAR = 'sides/CLEAR'
export const SIDES_TOGGLE = 'sides/TOGGLE'
export const SIDES_CLOSE_ALL = 'sides/CLOSE_ALL'
export const SIDES_TOGGLE_MAIN_MENU = 'sides/TOGGLE_MAIN_MENU'

export const DUCK_SIDES = 'sides'

export const sidesPush = ({ component, panelKey, isOpened, componentProps, direction, drawerProps, preCloseAction }) => (dispatch) => dispatch({
  type: SIDES_PUSH,
  component,
  panelKey,
  isOpened,
  componentProps,
  direction,
  drawerProps,
  preCloseAction,
})

export const sidesPop = (key) => (dispatch) => dispatch({ type: SIDES_POP, key })

export const sidesClear = () => (dispatch) => dispatch({ type: SIDES_CLEAR })

export const sidesClose = sidesPop
export const sidesOpen = sidesPush
