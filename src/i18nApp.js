/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import 'flexboxgrid/css/flexboxgrid.css'
import { bootstrap } from '@chronobank/core/redux/session/thunks'
import { store } from 'redux/configureStore'
import i18n from './i18n'

store.dispatch(bootstrap()).then(() => {
  document.getElementById('react-root').innerText = JSON.stringify(i18n)
})
