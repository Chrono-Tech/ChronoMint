/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'
import { DUCK_I18N } from 'redux/i18n/constants'
import { i18nReducer } from 'react-redux-i18n'
import { Map } from 'immutable'
import { persistReducer } from 'redux-persist'
import { reducer as formReducer } from 'redux-form/immutable'
import storage from 'redux-persist/lib/storage'

import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { DUCK_WALLETS } from '@chronobank/core/redux/wallets/constants'
import { middlewareWebSocketReducer } from '@chronobank/core/services/WebSocketService'
import { SESSION_DESTROY } from '@chronobank/core/redux/session/constants'
import apiReducer from '@chronobank/nodes/redux/reducer'
import coreReducers from '@chronobank/core/redux/ducks'
import loginReducers from '@chronobank/login/redux/ducks'
import persistAccountReducer from '@chronobank/core/redux/persistAccount/reducer'
import walletsReducer from '@chronobank/core/redux/wallets/reducer'
import ducks from './ducks'

// Configs for persists of store parts
const walletsPersistConfig = {
  key: DUCK_WALLETS,
  storage: storage,
  // There is an issue in the source code of redux-persist (default setTimeout does not cleaning)
  // See https://github.com/rt2zz/redux-persist/issues/786#issuecomment-421850652
  timeout: null,
}

const accountPersistConfig = {
  key: DUCK_PERSIST_ACCOUNT,
  storage: storage,
  blacklist: ['decryptedWallet'],
  // There is an issue in the source code of redux-persist (default setTimeout does not cleaning)
  // See https://github.com/rt2zz/redux-persist/issues/786#issuecomment-421850652
  timeout: null,
}

// Combine all App's reducers
const appReducer = combineReducers({
  ...coreReducers,
  ...ducks,
  ...loginReducers,
  form: formReducer,
  i18n: i18nReducer,
  nodes: apiReducer,
  [DUCK_PERSIST_ACCOUNT]: persistReducer(accountPersistConfig, persistAccountReducer),
  [DUCK_WALLETS]: persistReducer(walletsPersistConfig, walletsReducer),
  ws: middlewareWebSocketReducer,
})

export default (state, action) => {
  // TODO: I suppose that there is more appropriate place for this...
  if (action.type === SESSION_DESTROY) {
    const i18nState = state.get(DUCK_I18N)
    const persistAccount = state.get(DUCK_PERSIST_ACCOUNT)
    const wallets = state.get(DUCK_WALLETS)
    let newState = new Map()
    newState = newState
      .set(DUCK_I18N, i18nState)
      .set(DUCK_PERSIST_ACCOUNT, persistAccount)
      .set(DUCK_WALLETS, wallets)
    return appReducer(newState, action)
  }
  return appReducer(state, action)
}
