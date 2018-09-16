/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_I18N } from 'redux/i18n/constants'
import { I18n, loadTranslations, setLocale } from 'react-redux-i18n'
import { loadI18n } from 'redux/i18n/actions'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import moment from 'moment'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React from 'react'
import { WebSocketService } from '@chronobank/core/services/WebSocketService'
import router from './router'
import configureStore from './redux/configureStore'
import localStorage from './utils/LocalStorage'
import themeDefault from './themeDefault'
import translations from './i18n'

// eslint-disable-next-line no-unused-vars
let i18nJson // declaration of a global var for the i18n object for a standalone version

const { store, history, persistor } = configureStore()

WebSocketService.initWebSocketService(store)

// syncTranslationWithStore(store) relaced with manual configuration in the next 6 lines
I18n.setTranslationsGetter(() => store.getState().get(DUCK_I18N).translations)
I18n.setLocaleGetter(() => store.getState().get(DUCK_I18N).locale)
const locale = localStorage.getLocale()
moment.locale(locale)
store.dispatch(loadTranslations(translations))
store.dispatch(setLocale(locale))
// load i18n from the public site
store.dispatch(loadI18n(locale))

// fix for 'for-of' iterations for iPhone6/Safari
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
FileList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

render(
  <Provider store={store}>
    <PersistGate loader={null} persistor={persistor}>
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
