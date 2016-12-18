import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import LOC from '../modules/LOCs/reducer'
//import p2p from './modules/p2p'
import { reducer as reduxFormReducer } from 'redux-form'

export default combineReducers({
  LOC,
//  p2p,
  router,
  form: reduxFormReducer
})
