/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { globalWatcher } from '@chronobank/core/redux/watcher/actions'
import { SESSION_DESTROY } from '@chronobank/core/redux/session/actions'
import web3Factory from '@chronobank/core/refactor/web3/index'
import { browserHistory, createMemoryHistory } from 'react-router'
import { combineReducers } from 'redux-immutable'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore } from 'redux-persist-immutable'
import { reducer as formReducer } from 'redux-form/immutable'
import { DUCK_I18N, loadI18n } from 'redux/i18n/actions'
import { I18n, i18nReducer, loadTranslations, setLocale } from 'platform/i18n'
import moment from 'moment'
import saveAccountMiddleWare from '@chronobank/core/redux/session/saveAccountMiddleWare'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import thunk from 'redux-thunk'
import ls from 'platform/utils/LocalStorage'
import * as ducks from './ducks'
import routingReducer from './routing'
import transformer from './serialize'

// eslint-disable-next-line
let i18nJson // declaration of a global var for the i18n object for a standalone version

const historyEngine = process.env.NODE_ENV === 'standalone' ? createMemoryHistory() : browserHistory

const web3 = typeof window !== 'undefined'
  ? web3Factory()
  : null

const getNestedReducers = (ducks) => {
  let reducers = {}
  Object.entries(ducks).forEach(([key, entry]) => {
    reducers = { ...reducers, ...(typeof (entry) === 'function' ? { [key]: entry } : getNestedReducers(entry)) }
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
  '@chronobank/core/market/UPDATE_RATES',
  '@chronobank/core/market/UPDATE_LAST_MARKET',
  '@chronobank/core/market/UPDATE_PRICES',
]

let logActions = process.env.NODE_ENV === 'development'
  ? function (action) {
    if (IGNORED_ACTIONS.includes(action.type)) {
      return
    }
    // eslint-disable-next-line
    console.log(`%c ${action.type} `, 'color: #999; background: #333')
  }
  : function () {
  }

const configureStore = () => {
  const initialState = new Immutable.Map()

  const nestedReducers = getNestedReducers(ducks)
  const appReducer = combineReducers({
    form: formReducer,
    i18n: i18nReducer,
    routing: routingReducer,
    ...nestedReducers,
    multisigWallet: nestedReducers.multisigWallet(web3),
    mainWallet: nestedReducers.mainWallet(web3),
  })

  const rootReducer = (state, action) => {
    // workaround until fix redux devtool
    logActions(action)

    if (action.type === SESSION_DESTROY) {
      const i18nState = state.get('i18n')
      const mainWalletsState = state.get('mainWallet')
      const walletsState = state.get('multisigWallet')
      const persistAccount = state.get('persistAccount')
      state = new Immutable.Map()
      state = state
        .set('i18n', i18nState)
        .set('multisigWallet', walletsState)
        .set('mainWallet', mainWalletsState)
        .set('persistAccount', persistAccount)
    }
    return appReducer(state, action)
  }

  // noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(historyEngine),
      saveAccountMiddleWare,
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

const persistorConfig = {
  key: 'root',
  whitelist: ['multisigWallet', 'mainWallet', 'persistAccount'],
  transforms: [transformer()],
}
store.__persistor = persistStore(store, persistorConfig)

export const history = syncHistoryWithStore(historyEngine, store, {
  selectLocationState: createSelectLocationState(),
})

// syncTranslationWithStore(store) relaced with manual configuration in the next 6 lines
I18n.setTranslationsGetter(() => store.getState().get(DUCK_I18N).translations)
I18n.setLocaleGetter(() => store.getState().get(DUCK_I18N).locale)

const locale = ls.getLocale()
// set moment locale
moment.locale(locale)

store.dispatch(loadTranslations(require('../i18n/').default))
store.dispatch(setLocale(locale))

// load i18n from the public site
store.dispatch(loadI18n(locale))
/** <<< i18n END */
