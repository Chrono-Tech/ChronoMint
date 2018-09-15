/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'connected-react-router/immutable'
import thunk from 'redux-thunk'

import axiosMiddleware from '@chronobank/nodes/httpNodes/axiosMiddleware'
import nodesMiddleware from '@chronobank/nodes/redux/nodesMiddleware'

const getReduxLoggerMiddleware = () => {
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
    'persist/',
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
    // 'persist/',
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
  return logger
}

export default (history) => {
  const middleware = [
    thunk,
    routerMiddleware(history),
    nodesMiddleware,
    axiosMiddleware,
  ]
  const isDevelopmentEnv = process.env.NODE_ENV === 'development'
  if (isDevelopmentEnv) {
    // Note: logger must be the last middleware in chain, otherwise it will log thunk and promise, not actual actions
    middleware.push(getReduxLoggerMiddleware())
  }

  return middleware
}
