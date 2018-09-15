/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { applyMiddleware, compose, createStore } from 'redux'
import { combineReducers } from 'redux-immutable'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import { createLogger } from 'redux-logger'
import { DUCK_I18N } from 'redux/i18n/constants'
import { i18nReducer } from 'react-redux-i18n'
import { persistStore, persistReducer } from 'redux-persist'
import { reducer as formReducer } from 'redux-form/immutable'
import { routerMiddleware, connectRouter } from 'connected-react-router/immutable'
import { Map } from 'immutable'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { DUCK_WALLETS } from '@chronobank/core/redux/wallets/constants'
import { middlewareWebSocketReducer } from '@chronobank/core/services/WebSocketService'
import { SESSION_DESTROY } from '@chronobank/core/redux/session/constants'
import apiReducer from '@chronobank/nodes/redux/reducer'
import axiosMiddleware from '@chronobank/nodes/httpNodes/axiosMiddleware'
import coreReducers from '@chronobank/core/redux/ducks'
import loginReducers from '@chronobank/login/redux/ducks'
import nodesMiddleware from '@chronobank/nodes/redux/nodesMiddleware'
import persistAccountReducer from '@chronobank/core/redux/persistAccount/reducer'
import walletsReducer from '@chronobank/core/redux/wallets/reducer'
import ducks from './ducks'

const walletsPersistConfig = {
  key: 'wallets',
  storage: storage,
}

const accountPersistConfig = {
  key: 'account',
  storage: storage,
  blacklist: ['decryptedWallet', 'rehydrated'],
}

export const rootReducer = (state, action) => {

  if (action.type === SESSION_DESTROY) {
    const i18nState = state.get(DUCK_I18N)
    const persistAccount = state.get(DUCK_PERSIST_ACCOUNT)
    const wallets = state.get(DUCK_WALLETS)
    state = new Map()
    state = state
      .set(DUCK_I18N, i18nState)
      .set(DUCK_PERSIST_ACCOUNT, persistAccount)
      .set(DUCK_WALLETS, wallets)
  }
  return combineReducers({
    ...coreReducers,
    ...ducks,
    ...loginReducers,
    form: formReducer,
    i18n: i18nReducer,
    nodes: apiReducer,
    // persistAccount: persistReducer(accountPersistConfig, persistAccountReducer),
    // wallets: persistReducer(walletsPersistConfig, walletsReducer),
    ws: middlewareWebSocketReducer,
  })
}

// const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer)

const configureStore = () => {
  const initialState = new Map()

  const isDevelopmentEnv = process.env.NODE_ENV === 'development'
  const composeEnhancers = isDevelopmentEnv
    ? composeWithDevTools({ realtime: true })
    : compose

  const history = createBrowserHistory()

  const middleware = [
    thunk,
    routerMiddleware(history),
    nodesMiddleware,
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
       '@@router/',
      // '@login/network',
      // 'AssetsManager/',
      'daos/',
      // 'ethMultisigWallet/',
      // 'events/',
      // 'mainWallet/',
      // 'market/',
      // 'MIDDLEWARE/WEB_SOCKET/',
      // 'MODALS/',
      'NODES/',
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
      // '@@router/',
      '@login/network',
      'AssetsManager/',
      // 'daos/',
      'ethMultisigWallet/',
      'events/',
      'mainWallet/',
      'market/',
      'MIDDLEWARE/WEB_SOCKET/',
      'MODALS/',
      // 'NODES/',
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

  const store = createStoreWithMiddleware(
    connectRouter(history)(rootReducer),
    initialState,
  )

  const persistor = persistStore(store)

  return { store, history, persistor }
}

export default configureStore
