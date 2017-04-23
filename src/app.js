import React from 'react'
import {render} from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import themeDefault from './themeDefault'
import injectTapEventPlugin from 'react-tap-event-plugin'
import './styles.scss'
import 'font-awesome/css/font-awesome.css'
import 'flexboxgrid/css/flexboxgrid.css'

class App {
  start () {
    injectTapEventPlugin()
    window.resolveWeb3.then(() => {
      render(
        <MuiThemeProvider muiTheme={themeDefault}>{require('./router.js')}</MuiThemeProvider>,
        document.getElementById('react-root')
      )
    })
  }
}

export default new App()
