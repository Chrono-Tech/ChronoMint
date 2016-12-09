import { createAction } from 'redux-actions'

let actionCreators = {
  selectCard: createAction('MAIN_SELECT_CARD'),
  togglePremium: createAction('MAIN_TOGGLE_PREMIUM')
}

export default actionCreators
