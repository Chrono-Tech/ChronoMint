/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import 'flexboxgrid/css/flexboxgrid.css'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React from 'react'
import { render } from 'react-dom'
import { bootstrap } from '@chronobank/core/redux/session/thunks'
import { persistStore } from 'redux-persist-immutable'
import { loadI18n } from 'redux/i18n/actions'
import { I18n, loadTranslations, setLocale } from 'react-redux-i18n'
import moment from 'moment'
import localStorage from 'utils/LocalStorage'
import transformer from '@chronobank/core/redux/serialize'
import { WebSocketService } from '@chronobank/core/services/WebSocketService'
import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { DUCK_WALLETS } from '@chronobank/core/redux/wallets/constants'
import { DUCK_I18N } from 'redux/i18n/constants'
import configureStore from './redux/configureStore'
import router from './router'
import themeDefault from './themeDefault'
import translations from './i18n'

require('events').EventEmitter.defaultMaxListeners = 0

// eslint-disable-next-line no-unused-vars
let i18nJson // declaration of a global var for the i18n object for a standalone version

const  { store, history } = configureStore()

WebSocketService.initWebSocketService(store)

const persistorConfig = {
  key: 'root',
  whitelist: [DUCK_PERSIST_ACCOUNT, DUCK_WALLETS],
  transforms: [transformer()],
}

// eslint-disable-next-line no-underscore-dangle
store.__persistor = persistStore(store, persistorConfig)

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

// fix for 'for-of' iterations for iPhone6/Safari
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
FileList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

store
  .dispatch(bootstrap())
  .then(() => {
    render(
      <MuiThemeProvider theme={themeDefault}>
        {router(store, history)}
      </MuiThemeProvider>,
      document.getElementById('react-root'),
    )
  })
