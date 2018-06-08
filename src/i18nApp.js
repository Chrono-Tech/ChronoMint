/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import 'flexboxgrid/css/flexboxgrid.css'
import networkService from '@chronobank/login/network/NetworkService'
import i18n from 'i18n/index'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { bootstrap } from '@chronobank/core/redux/session/actions'
import { store } from 'redux/configureStore'

networkService.connectStore(store)
injectTapEventPlugin()
store.dispatch(bootstrap()).then(() => {
  document.getElementById('react-root').innerText = JSON.stringify(i18n)
})
