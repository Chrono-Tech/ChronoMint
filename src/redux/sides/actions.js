export const SIDES_PUSH = 'sides/PUSH'
export const SIDES_POP = 'sides/POP'
export const SIDES_CLEAR = 'sides/CLEAR'

export const SIDES_OPEN_PROFILE_PANEL = 'sides/OPEN_PROFILE_PANEL'
export const SIDES_CLOSE_PROFILE_PANEL = 'sides/CLOSE_PROFILE_PANEL'

export const DUCK_SIDES = 'sides'

export const sidesPush = ({ component, key, props }) => (dispatch) => dispatch({ type: SIDES_PUSH, component, key, props })
export const sidesPop = (key) => (dispatch) => dispatch({ type: SIDES_POP, key })
export const sidesClear = () => (dispatch) => dispatch({ type: SIDES_CLEAR })

export const sidesClose = sidesPop
export const sidesOpen = sidesPush

export const openProfilePanel = () => (dispatch) => dispatch({ type: SIDES_OPEN_PROFILE_PANEL })
export const closeProfilePanel = () => (dispatch) => dispatch({ type: SIDES_CLOSE_PROFILE_PANEL })
