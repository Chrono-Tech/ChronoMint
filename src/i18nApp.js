import 'flexboxgrid/css/flexboxgrid.css'
import networkService from '@chronobank/login/network/NetworkService'
import i18n from 'i18n/index'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { bootstrap } from './redux/session/actions'
import { store } from './redux/configureStore'

networkService.connectStore(store)
injectTapEventPlugin()
store.dispatch(bootstrap()).then(() => {
  document.getElementById('react-root').innerText = JSON.stringify(i18n)
})
