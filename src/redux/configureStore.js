import thunk from 'redux-thunk'
import Immutable from 'immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory, createMemoryHistory } from 'react-router'
import { combineReducers } from 'redux-immutable'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { loadTranslations, setLocale, i18nReducer, I18n } from 'react-redux-i18n'
import { reducer as formReducer } from 'redux-form/immutable'
import moment from 'moment'

import routingReducer from './routing'
import * as ducks from './ducks'
import { globalWatcher } from './watcher/actions'
import ls from 'utils/LocalStorage'
import { SESSION_DESTROY } from './session/actions'

const historyEngine = process.env.NODE_ENV === 'standalone' ? createMemoryHistory() : browserHistory

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
  const initialState = new Immutable.Map()

  const appReducer = combineReducers({
    form: formReducer,
    i18n: i18nReducer,
    routing: routingReducer,
    ...getNestedReducers(ducks)
  })

  const rootReducer = (state, action) => {
    if (action.type === SESSION_DESTROY) {
      const i18nState = state.get('i18n')
      state = new Immutable.Map()
      state = state.set('i18n', i18nState)
    }
    return appReducer(state, action)
  }

  //noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(historyEngine)
    ),
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
      : (f) => f
  )(createStore)

  return createStoreWithMiddleware(
    rootReducer,
    initialState
  )
}

export const store = configureStore()
store.dispatch(globalWatcher())

export const history = syncHistoryWithStore(historyEngine, store, {
  selectLocationState: createSelectLocationState()
})

// syncTranslationWithStore(store) relaced with manual connfiguration in the next 6 lines
I18n.setTranslationsGetter(() => {
  return store.getState().get('i18n').translations
})
I18n.setLocaleGetter(() => {
  return store.getState().get('i18n').locale
})

const locale = ls.getLocale()
// set moment locale
moment.locale(locale)

store.dispatch(loadTranslations(require('../i18n/')))
store.dispatch(setLocale(locale))
/** <<< i18n END */
