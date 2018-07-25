/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import 'flexboxgrid/css/flexboxgrid.css'
import networkService from '@chronobank/login/network/NetworkService'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React from 'react'
import { render } from 'react-dom'
import { bootstrap } from '@chronobank/core/redux/session/actions'
import { store } from './redux/configureStore'
import router from './router'
import themeDefault from './themeDefault'
import LogRocket from 'logrocket'

class App {
  start () {
    LogRocket.init('c1vf8w/chronobank')
    networkService.connectStore(store)
    store.dispatch(bootstrap()).then(() => {
      render(
        <MuiThemeProvider theme={themeDefault}>
          {router}
        </MuiThemeProvider>,
        document.getElementById('react-root'),
      )
    })
  }
}

export default new App()
