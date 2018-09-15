/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { applyMiddleware, compose, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import { persistStore } from 'redux-persist'
import { connectRouter } from 'connected-react-router/immutable'
import { Map } from 'immutable'

import rootReducer from './rootReducer'
import getMiddlewares from './middlewares'

const initialState = new Map()

const configureStore = () => {

  const isDevelopmentEnv = process.env.NODE_ENV === 'development'
  const composeEnhancers = isDevelopmentEnv
    ? composeWithDevTools({ realtime: true })
    : compose

  const history = createBrowserHistory()

  const middleware = getMiddlewares(history)

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
