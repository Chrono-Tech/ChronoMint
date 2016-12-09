import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import LOC from './modules/LOC'
import p2p from './modules/p2p'

export default combineReducers({
  LOC,
  p2p,
  router
})
