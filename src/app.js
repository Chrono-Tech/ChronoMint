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
import ChronoMintDAO from './dao/ChronoMintDAO'

class App {
  start () {
    IPFSDAO.init().then(ipfsNode => {
      OrbitDAO.init(ipfsNode)

      injectTapEventPlugin()
      return ChronoMintDAO.getAddress().then((r) => {
        if (!r) {
          throw new Error('Couldn\'t connect. Contracts has not been deployed to detected network. Local ethereum node, mist browser or google chrome with metamask plugin should be used')
        }
        window.resolveWeb3.then(() => {
          if (window.location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            window.location.protocol = 'https:'
            window.location.reload()
          }
          render(
            <MuiThemeProvider muiTheme={themeDefault}>{require('./router.js')}</MuiThemeProvider>,
            document.getElementById('react-root')
          )
        })
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
