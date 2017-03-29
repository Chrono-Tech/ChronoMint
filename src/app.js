import React from 'react'
import {render} from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import themeDefault from './themeDefault'
import injectTapEventPlugin from 'react-tap-event-plugin'
import router from './router.js'
import IPFSDAO from './dao/IPFSDAO'
import OrbitDAO from './dao/OrbitDAO'
import './styles.scss'
import 'font-awesome/css/font-awesome.css'
import 'flexboxgrid/css/flexboxgrid.css'
import ErrorPage from './pages/ErrorPage'

class App {
  start () {
    IPFSDAO.init().then(ipfsNode => {
      OrbitDAO.init(ipfsNode)

      /** Needed for onTouchTap @link http://stackoverflow.com/a/34015469/988941 */
      injectTapEventPlugin()

      render(
        <MuiThemeProvider muiTheme={themeDefault}>{router}</MuiThemeProvider>,
        document.getElementById('react-root')
      )
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
