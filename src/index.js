/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_I18N } from 'redux/i18n/constants'
import { I18n, loadTranslations, setLocale } from 'react-redux-i18n'
import { loadI18n } from 'redux/i18n/actions'
import { render } from 'react-dom'
import moment from 'moment'
import React from 'react'
import { hot } from 'react-hot-loader'
import { WebSocketService } from '@chronobank/core/services/WebSocketService'
import { ConnectedRouter } from 'connected-react-router/immutable'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import router from './router'
import themeDefault from './themeDefault'
import configureStore from './redux/configureStore'
import localStorage from './utils/LocalStorage'
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

const hashLinkScroll = () => {
  const { hash } = window.location
  if (hash !== '') {
    setTimeout(() => {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) element.scrollIntoView()
    }, 0)
  }
}

const APP = (
  <Provider store={store}>
    <PersistGate loader={null} persistor={persistor}>
      <MuiThemeProvider theme={themeDefault}>
        <ConnectedRouter history={history} onUpdate={hashLinkScroll}>
          {router(store)}
        </ConnectedRouter>
      </MuiThemeProvider>
    </PersistGate>
  </Provider>
)

if (process.env.NODE_ENV === 'development') {
  render(hot(module)(APP))
} else {
  render(APP)
}
