export const SIDES_PUSH = 'sides/PUSH'
export const SIDES_POP = 'sides/POP'
export const SIDES_CLEAR = 'sides/CLEAR'

export const DUCK_SIDES = 'sides'

export const sidesPush = ({ component, panelKey, isOpened, componentProps }) => (dispatch) => dispatch({ type: SIDES_PUSH, component, panelKey, isOpened, componentProps })

export const sidesPop = (key) => (dispatch) => dispatch({ type: SIDES_POP, key })

export const sidesClear = () => (dispatch) => dispatch({ type: SIDES_CLEAR })

export const sidesClose = sidesPop
export const sidesOpen = sidesPush
