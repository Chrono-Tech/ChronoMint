import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import simpleStorage from './modules/simpleStorage'
import p2p from './modules/p2p'

export default combineReducers({
  simpleStorage,
  p2p,
  router
})
