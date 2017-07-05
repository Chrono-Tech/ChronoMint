import thunk from 'redux-thunk'
import Immutable from 'immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory } from 'react-router'
import { combineReducers } from 'redux-immutable'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { loadTranslations, setLocale, i18nReducer } from 'react-redux-i18n'
import { reducer as formReducer } from 'redux-form/immutable'

import routingReducer from './routing'
import * as ducks from './ducks'
import ls from 'utils/LocalStorage'
import { SESSION_DESTROY } from './session/actions'

const getNestedReducers = (ducks) => {
  let reducers = {}
  Object.keys(ducks).forEach(r => {
    reducers = {...reducers, ...(typeof (ducks[r]) === 'function' ? {[r]: ducks[r]} : getNestedReducers(ducks[r]))}
  })
  return reducers
}

// Create enhanced history object for router
const createSelectLocationState = () => {
  let prevRoutingState, prevRoutingStateJS
  return (state) => {
    const routingState = state.get('routing') // or state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

const configureStore = () => {
  const initialState = new Immutable.Map()

  const appReducer = combineReducers({
    form: formReducer,
    i18n: i18nReducer,
    routing: routingReducer,
    ...getNestedReducers(ducks)
  })

  const rootReducer = (state, action) => {
    if (action.type === SESSION_DESTROY) {
      const i18nState = state.get('i18n')
      state = new Immutable.Map()
      state = state.set('i18n', i18nState)
    }
    return appReducer(state, action)
  }

  //noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(browserHistory)
    ),
    window.devToolsExtension
      ? window.devToolsExtension()
      : (f) => f
  )(createStore)

  return createStoreWithMiddleware(
    rootReducer,
    initialState
  )
}

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: createSelectLocationState()
})

//noinspection NpmUsedModulesInstalled
/** i18n START >>> */
const _reactI18nify = require('react-i18nify')
//noinspection JSUnresolvedVariable,JSUnresolvedFunction
_reactI18nify.I18n.setTranslationsGetter(() => {
  return store.getState().get('i18n').translations
})
//noinspection JSUnresolvedVariable,JSUnresolvedFunction
_reactI18nify.I18n.setLocaleGetter(() => {
  return store.getState().get('i18n').locale
})

store.dispatch(setLocale(ls.getLocale()))
store.dispatch(loadTranslations(require('../i18n/')))
/** <<< i18n END */

export { store, history }
