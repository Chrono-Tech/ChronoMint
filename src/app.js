/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import 'flexboxgrid/css/flexboxgrid.css'
import networkService from '@chronobank/login/network/NetworkService'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React from 'react'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { bootstrap } from '@chronobank/core/redux/session/actions'
import { store } from './redux/configureStore'
import router from './router'
import themeDefault from './themeDefault'

class App {
  start () {
    networkService.connectStore(store)
    injectTapEventPlugin()
    store.dispatch(bootstrap()).then(() => {
      render(
        <MuiThemeProvider muiTheme={themeDefault}>
          {router}
        </MuiThemeProvider>,
        document.getElementById('react-root')
      )
    })
  }
}

export default new App()
