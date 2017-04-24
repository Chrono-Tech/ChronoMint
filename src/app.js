import React from 'react'
import {render} from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import themeDefault from './themeDefault'
import injectTapEventPlugin from 'react-tap-event-plugin'
import IPFSDAO from './dao/IPFSDAO'
import OrbitDAO from './dao/OrbitDAO'
import './styles.scss'
import 'font-awesome/css/font-awesome.css'
import 'flexboxgrid/css/flexboxgrid.css'
import ErrorPage from './pages/ErrorPage'
import router from './router'
import { store } from './redux/configureStore'
import { checkMetaMask, checkTestRPC } from './redux/network/networkAction'

class App {
  start () {
    store.dispatch(checkMetaMask())
    store.dispatch(checkTestRPC())

    IPFSDAO.init().then(ipfsNode => {
      OrbitDAO.init(ipfsNode)

      injectTapEventPlugin()
      render(
        <MuiThemeProvider muiTheme={themeDefault}>
          {router}
        </MuiThemeProvider>,
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
