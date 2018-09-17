/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/* eslint-disable react/jsx-no-bind */

import { DUCK_I18N } from 'redux/i18n/constants'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { I18n, loadTranslations, setLocale } from 'react-redux-i18n'
import { loadI18n } from 'redux/i18n/actions'
import { nodesInit } from '@chronobank/nodes/redux/actions'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { WebSocketService } from '@chronobank/core/services/WebSocketService'
import moment from 'moment'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import PersistLoader from 'layouts/partials/PersistLoader/PersistLoader'
import React from 'react'
import configureStore from './redux/configureStore'
import router from './router'
import themeDefault from './themeDefault'
import translations from './i18n'

const { store, history, persistor } = configureStore()

// fix for 'for-of' iterations for iPhone6/Safari
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
FileList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

// eslint-disable-next-line no-unused-vars
let i18nJson // declaration of a global var for the i18n object for a standalone version, see 'loadI18n' action

const initAfterRehydration = async () => {
  const dispatch = store.dispatch

  // Locale init
  I18n.setTranslationsGetter(() => store.getState().get(DUCK_I18N).translations)
  I18n.setLocaleGetter(() => store.getState().get(DUCK_I18N).locale)

  // const locale = localStorage.getLocale()
  const { locale } = store.getState().get(DUCK_PERSIST_ACCOUNT)
  // set moment locale
  moment.locale(locale)

  dispatch(loadTranslations(translations))
  dispatch(setLocale(locale))

  // load i18n from the public site
  await dispatch(loadI18n(locale))

  // Network init
  // dispatch(preselectNetwork()) // Automatic selection of a primary node and network (mainnet/testnet)
  await dispatch(nodesInit()) // Init Nodes middlware (working with Ehtereum primary nodes via web3)
  // TODO: WebSocketService we be removed. Let's it be here for now
  WebSocketService.initWebSocketService(store)
}

render(
  <Provider store={store}>
    <PersistGate
      loader={PersistLoader}
      persistor={persistor}
      onBeforeLift={initAfterRehydration}
    >
      <MuiThemeProvider theme={themeDefault}>
        {
          router(history)
        }
      </MuiThemeProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('react-root')
)

// // Hot reloading
// if (process.env.NODE_ENV === 'development') {
//   if (module.hot) {
//     // Reload components
//     module.hot.accept('./App', () => {
//       render()
//     })

//     // Reload reducers
//     module.hot.accept('./redux/rootReducer', () => {
//       store.replaceReducer(connectRouter(history)(rootReducer))
//     })
//   }
// }
