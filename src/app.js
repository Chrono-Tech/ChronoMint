import React from 'react'
import {render} from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import themeDefault from './themeDefault'
import injectTapEventPlugin from 'react-tap-event-plugin'
import './styles.scss'
import 'font-awesome/css/font-awesome.css'
import 'flexboxgrid/css/flexboxgrid.css'
import ErrorPage from './pages/ErrorPage'

class App {
  start () {
    window.resolveWeb3 = new Promise(resolve => {
      window.addEventListener('load', function () {
        resolve(window.hasOwnProperty('web3') ? window.web3 : null)
      })
    })

    injectTapEventPlugin()

    window.resolveWeb3.then(() => {
      require('./dao/ChronoMintDAO').checkDeployed().then((r) => {
        if (!r.error) {
          render(
            <MuiThemeProvider muiTheme={themeDefault}>{require('./router.js')}</MuiThemeProvider>,
            document.getElementById('react-root')
          )
          return
        }
        render(
          <MuiThemeProvider muiTheme={themeDefault}>
            <ErrorPage error={r.error} />
          </MuiThemeProvider>,
          document.getElementById('react-root')
        )
      })
    }).catch(e => {
      render(
        <MuiThemeProvider muiTheme={themeDefault}>
          <ErrorPage error={e} />
        </MuiThemeProvider>,
        document.getElementById('react-root')
      )
    })
  }
}

export default new App()
