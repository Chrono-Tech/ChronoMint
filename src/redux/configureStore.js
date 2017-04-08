import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {Map} from 'immutable'
import {browserHistory} from 'react-router'
import {combineReducers} from 'redux-immutable'
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form/immutable'
import routingReducer from './routing'
import * as ducksReducers from './ducks'
import {SESSION_DESTROY} from './session/actions'

const getNestedReducers = (ducks) => {
  let reducers = {}
  Object.keys(ducks).forEach(r => {
    reducers = {...reducers, ...(typeof (ducks[r]) === 'function' ? {[r]: ducks[r]} : getNestedReducers(ducks[r]))}
  })
  return reducers
}

// Create enhanced history object for router
const createSelectLocationState = () => {
  let prevRoutingState, prevRoutingStateJS
  return (state) => {
    const routingState = state.get('routing') // or state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

const configureStore = () => {
  const initialState = new Map()

  const appReducer = combineReducers({
    form: formReducer,
    routing: routingReducer,
    ...getNestedReducers(ducksReducers)
  })

  const rootReducer = (state, action) => {
    if (action.type === SESSION_DESTROY) {
      state = undefined
    }
    return appReducer(state, action)
  }

  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(browserHistory)
    ),
    window.devToolsExtension
      ? window.devToolsExtension()
      : (f) => f
  )(createStore)

  return createStoreWithMiddleware(
    rootReducer,
    initialState
  )
}

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: createSelectLocationState()
})

export {store, history}
