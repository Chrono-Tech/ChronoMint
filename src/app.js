import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import themeDefault from './themeDefault'
import 'flexboxgrid/css/flexboxgrid.css'
import router from './router'
import { store } from './redux/configureStore'
import { bootstrap } from './redux/bootstrap/actions'
import injectTapEventPlugin from 'react-tap-event-plugin'
import './connectReactNative'

window.isMobile = window.location.href.startsWith('http://localhost:8081/assets')

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
