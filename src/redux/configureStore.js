/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { browserHistory, createMemoryHistory } from 'react-router'
import { combineReducers } from 'redux-immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import { reducer as formReducer } from 'redux-form/immutable'
import { loadI18n, DUCK_I18N } from 'redux/i18n/actions'
import { loadTranslations, setLocale, i18nReducer, I18n } from 'platform/i18n'
import moment from 'moment'
import saveAccountMiddleWare from 'redux/session/saveAccountMiddleWare'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import ls from 'utils/LocalStorage'
import * as ducks from './ducks'
import { globalWatcher } from './watcher/actions'
import routingReducer from './routing'
import { SESSION_DESTROY } from './session/actions'

let i18nJson // declaration of a global var for the i18n object for a standalone version

const historyEngine = process.env.NODE_ENV === 'standalone' ? createMemoryHistory() : browserHistory

const getNestedReducers = (ducks) => {
  let reducers = {}
  Object.keys(ducks).forEach((r) => {
    reducers = { ...reducers, ...(typeof (ducks[r]) === 'function' ? { [r]: ducks[r] } : getNestedReducers(ducks[r])) }
  })
  return reducers
}

// Create enhanced history object for router
const createSelectLocationState = () => {
  let prevRoutingState,
    prevRoutingStateJS
  return (state) => {
    const routingState = state.get('routing') // or state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

// add noised action here
const IGNORED_ACTIONS = [
  'market/UPDATE_RATES',
  'market/UPDATE_LAST_MARKET',
  'market/UPDATE_PRICES',
]

let logActions = process.env.NODE_ENV === 'development'
  ? function (action) {
    if (IGNORED_ACTIONS.includes(action.type)) {
      return
    }
    // eslint-disable-next-line
    console.log(`%c ${action.type} `, 'color: #999; background: #333')
  }
  : function () {}

const configureStore = () => {
  const initialState = new Immutable.Map()

  const appReducer = combineReducers({
    form: formReducer,
    i18n: i18nReducer,
    routing: routingReducer,
    ...getNestedReducers(ducks),
  })

  const rootReducer = (state, action) => {
    // workaround until fix redux devtool
    logActions(action)

    if (action.type === SESSION_DESTROY) {
      const i18nState = state.get('i18n')
      state = new Immutable.Map()
      state = state.set('i18n', i18nState)
    }
    return appReducer(state, action)
  }

  // noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(historyEngine),
      saveAccountMiddleWare
    ),
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionsBlacklist: IGNORED_ACTIONS,
      })()
      : (f) => f,
  )(createStore)

  return createStoreWithMiddleware(
    rootReducer,
    initialState,
  )
}

export const store = configureStore()
store.dispatch(globalWatcher())

export const history = syncHistoryWithStore(historyEngine, store, {
  selectLocationState: createSelectLocationState(),
})

// syncTranslationWithStore(store) relaced with manual configuration in the next 6 lines
I18n.setTranslationsGetter(() => store.getState().get(DUCK_I18N).translations)
I18n.setLocaleGetter(() => store.getState().get(DUCK_I18N).locale)

const locale = ls.getLocale()
// set moment locale
moment.locale(locale)

store.dispatch(loadTranslations(require('../i18n/')))
store.dispatch(setLocale(locale))

// load i18n from the public site
store.dispatch(loadI18n(locale))
/** <<< i18n END */
