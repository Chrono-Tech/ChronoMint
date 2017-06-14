import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Map } from 'immutable'
import { browserHistory } from 'react-router'
import { combineReducers } from 'redux-immutable'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { loadTranslations, setLocale, i18nReducer } from 'react-redux-i18n'
import { reducer as formReducer } from 'redux-form/immutable'
import routingReducer from './routing'
import * as ducksReducers from './ducks'
import { SESSION_DESTROY } from './session/actions'
import LS from '../utils/LocalStorage'

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
  const initialState = new Map()

  const appReducer = combineReducers({
    form: formReducer,
    i18n: i18nReducer,
    routing: routingReducer,
    ...getNestedReducers(ducksReducers)
  })

  const rootReducer = (state, action) => {
    if (action.type === SESSION_DESTROY) {
      const i18nState = state.get('i18n')
      state = new Map()
      state = state.set('i18n', i18nState)
    }
    return appReducer(state, action)
  }

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

/** i18n START >>> */
const _reactI18nify = require('react-i18nify')
_reactI18nify.I18n.setTranslationsGetter(() => {
  try {
    return store.getState().get('i18n').translations
  } catch (e) {
    console.error('Error getting translations from store!')
  }
})
_reactI18nify.I18n.setLocaleGetter(() => {
  try {
    return store.getState().get('i18n').locale
  } catch (e) {
    console.error('Error getting locale from store!')
  }
})

// TODO @dkchv: !!!! restore
// store.dispatch(setLocale(LS.getLocale() || 'en'))
// store.dispatch(loadTranslations(require('../i18n/')))
/** <<< i18n END */

export { store, history }
