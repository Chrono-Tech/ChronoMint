/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { SESSION_DESTROY } from '@chronobank/core/redux/session/constants'
import { combineReducers } from 'redux-immutable'
import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist-immutable'
import { reducer as formReducer } from 'redux-form/immutable'
import { loadI18n } from 'redux/i18n/actions'
import { I18n, i18nReducer, loadTranslations, setLocale } from 'react-redux-i18n'
import moment from 'moment'
import thunk from 'redux-thunk'
import localStorage from 'utils/LocalStorage'
import coreReducers from '@chronobank/core/redux/ducks'
import loginReducers from '@chronobank/login/redux/ducks'
import { DUCK_I18N } from 'redux/i18n/constants'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { DUCK_WALLETS } from '@chronobank/core/redux/wallets/constants'
import transformer from '@chronobank/core/redux/serialize'
import { WebSocketService, middlewareWebSocketReducer } from '@chronobank/core/services/WebSocketService'
import axiosMiddleware from '@chronobank/api/http/middleware'
import networkSetReducer from '@chronobank/api/networks/reducer'
import ducks from './ducks'
import routingReducer from './routing'
import createHistory, { historyMiddleware } from './browserHistoryStore'
import translations from '../i18n'

// eslint-disable-next-line no-unused-vars
let i18nJson // declaration of a global var for the i18n object for a standalone version

const configureStore = () => {
  const initialState = new Immutable.Map()

  const appReducer = combineReducers({
    ...coreReducers,
    ...ducks,
    ...loginReducers,
    form: formReducer,
    i18n: i18nReducer,
    routing: routingReducer,
    NETSET: networkSetReducer,
    ws: middlewareWebSocketReducer,
  })

  const rootReducer = (state, action) => {

    if (action.type === SESSION_DESTROY) {
      const i18nState = state.get(DUCK_I18N)
      const persistAccount = state.get(DUCK_PERSIST_ACCOUNT)
      const wallets = state.get(DUCK_WALLETS)
      state = new Immutable.Map()
      state = state
        .set(DUCK_I18N, i18nState)
        .set(DUCK_PERSIST_ACCOUNT, persistAccount)
        .set(DUCK_WALLETS, wallets)
    }
    return appReducer(state, action)
  }

  const isDevelopmentEnv = process.env.NODE_ENV === 'development'
  const composeEnhancers = isDevelopmentEnv
    ? composeWithDevTools({ realtime: true })
    : compose

  const middleware = [
    thunk,
    historyMiddleware,
    axiosMiddleware,
  ]

  if (isDevelopmentEnv) {
    // Highest priority, IGNORED_ACTIONS and DOMAINS are ignored by WHITE_LIST
    const WHITE_LIST = []
    // The following actions will be ignored if not whitelisted but presents in DOMAINS
    // So, we can enable whole domain, but still exclude aome actions from domain
    const IGNORED_ACTIONS = [
      'market/ADD_TOKEN',
      'market/UPDATE_LAST_MARKET',
      'market/UPDATE_RATES',
      'tokens/fetched',
      'tokens/fetching',
      'tokens/updateLatestBlock',
      'wallet/updateBalance',
    ]
    // All actions like network/* (starts with network)
    const DOMAINS = [
      // '@@i18n/',
      // '@@redux-form/',
      // '@@router/',
      // '@login/network',
      // 'AssetsManager/',
      // 'daos/',
      // 'ethMultisigWallet/',
      // 'events/',
      // 'mainWallet/',
      // 'market/',
      'MIDDLEWARE/WEB_SOCKET/',
      // 'MODALS/',
      // 'persist/',
      // 'persistAccount/',
      // 'PROFILE/',
      // 'session/',
      // 'SIDEMENU/',
      // 'SIDES/',
      // 'tokens/',
      // 'TX/ETH/',
      // 'voting/',
      // 'wallet/',
      // 'watcher/',
    ]
    const IGNORED_DOMAINS = [
      '@@i18n/',
      '@@redux-form/',
      '@@router/',
      '@login/network',
      'AssetsManager/',
      'daos/',
      'ethMultisigWallet/',
      'events/',
      'mainWallet/',
      'market/',
      // 'MIDDLEWARE/WEB_SOCKET/',
      'MODALS/',
      'persist/',
      'persistAccount/',
      'PROFILE/',
      'session/',
      'SIDEMENU/',
      'SIDES/',
      'tokens/',
      'TX/ETH/',
      'voting/',
      'wallet/',
      'watcher/',
    ]
    const logger = createLogger({
      collapsed: true,
      predicate: (getState, action) => {
        if (!action.type) {
          // eslint-disable-next-line no-console
          console.error('%c action has no type field!', 'background: red; color: #fff', action)
          return true
        }
        const isWhiteListed = (WHITE_LIST.length > 0 && WHITE_LIST.includes(action.type)) ||
          DOMAINS.length > 0 && DOMAINS.some((domain) => action.type.startsWith(domain))
        const isIgnoredAction = IGNORED_ACTIONS.length > 0 && IGNORED_ACTIONS.includes(action.type)
        const isIgnoredDomain = IGNORED_DOMAINS.length > 0 && IGNORED_DOMAINS.some((domain) => action.type.startsWith(domain))

        return isWhiteListed || (!isIgnoredDomain && !isIgnoredAction)
      },
    })
    // Note: logger must be the last middleware in chain, otherwise it will log thunk and promise, not actual actions
    middleware.push(logger)
  }

  const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(...middleware),
  )(createStore)

  return createStoreWithMiddleware(
    rootReducer,
    initialState,
  )
}

export const store = configureStore()
// store.dispatch(globalWatcher())
WebSocketService.initWebSocketService(store)

const persistorConfig = {
  key: 'root',
  whitelist: [DUCK_PERSIST_ACCOUNT, DUCK_WALLETS],
  transforms: [transformer()],
}

// eslint-disable-next-line no-underscore-dangle
store.__persistor = persistStore(store, persistorConfig)

export const history = createHistory(store)

// syncTranslationWithStore(store) relaced with manual configuration in the next 6 lines
I18n.setTranslationsGetter(() => store.getState().get(DUCK_I18N).translations)
I18n.setLocaleGetter(() => store.getState().get(DUCK_I18N).locale)

const locale = localStorage.getLocale()
// set moment locale
moment.locale(locale)

store.dispatch(loadTranslations(translations))
store.dispatch(setLocale(locale))

// load i18n from the public site
store.dispatch(loadI18n(locale))
/** <<< i18n END */
