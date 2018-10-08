/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_PERSIST_ACCOUNT } from '@chronobank/core/redux/persistAccount/constants'
import { I18n, loadTranslations, setLocale } from 'react-redux-i18n'
import { nodesInit } from '@chronobank/nodes/redux/actions'
import { middlewareConnect } from '@chronobank/nodes/middleware/thunks'
// import { WebSocketService } from '@chronobank/core/services/WebSocketService'
import moment from 'moment'
import { DUCK_I18N } from './redux/i18n/constants'
import { loadI18n } from './redux/i18n/thunks'
import translations from './i18n'

export const initPrimaryNodes = async (store) => {
  // dispatch(preselectNetwork()) // Automatic selection of a primary node and network (mainnet/testnet)
  await store.dispatch(nodesInit()) // Init Nodes middlware (working with Ehtereum primary nodes via web3)
  // TODO: WebSocketService we be removed. Let's it be here for now
  // WebSocketService.initWebSocketService(store)
}

export const initI18N = async (store) => {
  // Locale init
  I18n.setTranslationsGetter(() => store.getState().get(DUCK_I18N).translations)
  I18n.setLocaleGetter(() => store.getState().get(DUCK_I18N).locale)

  // const locale = localStorage.getLocale()
  const { locale } = store.getState().get(DUCK_PERSIST_ACCOUNT)
  // set moment locale
  moment.locale(locale)

  store.dispatch(loadTranslations(translations))
  store.dispatch(setLocale(locale))

  // load i18n from the public site
  await store.dispatch(loadI18n(locale))
}

export const initChronobankMiddlewares = async (store) => {
  // // dispatch(preselectNetwork()) // Automatic selection of a primary node and network (mainnet/testnet)
  store.dispatch(nodesInit()) // Init Nodes middlware (working with Ehtereum primary nodes via web3)
  store.dispatch(middlewareConnect())
  // // TODO: WebSocketService we be removed. Let's it be here for now
  // WebSocketService.initWebSocketService(store)
}
