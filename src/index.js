/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/* eslint-disable react/jsx-no-bind */

import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import PersistLoader from 'layouts/partials/PersistLoader/PersistLoader'
import React from 'react'
import configureStore from './redux/configureStore'
import themeDefault from './themeDefault'
import * as Initializers from './initializers'
import Router from './Router'

const { store, history, persistor } = configureStore()

// fix for 'for-of' iterations for iPhone6/Safari
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
FileList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

// eslint-disable-next-line no-unused-vars
let i18nJson // declaration of a global var for the i18n object for a standalone version, see 'loadI18n' action

const initAfterRehydration = () => {
  Initializers.initI18N(store)
  Initializers.initPrimaryNodes(store)
}

render(
  <Provider store={store}>
    <PersistGate
      loader={PersistLoader}
      persistor={persistor}
      onBeforeLift={initAfterRehydration}
    >
      <MuiThemeProvider theme={themeDefault}>
        <Router history={history} />
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
