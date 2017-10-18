import 'flexboxgrid/css/flexboxgrid.css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { render } from 'react-dom'

import { bootstrap } from './redux/bootstrap/actions'
import router from './router'
import { store } from './redux/configureStore'
import themeDefault from './themeDefault'

class App {
  start () {
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
