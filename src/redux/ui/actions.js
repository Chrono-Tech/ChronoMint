/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import { setLocale } from 'react-redux-i18n'
import localStorage from 'utils/LocalStorage'
import ipfs from '@chronobank/core/utils/IPFS'
import userMonitorService from 'user/monitorService'
import { modalsOpen, modalsClose } from '@chronobank/core/redux/modals/actions'
import { CHANGE_WALLET_VIEW } from './constants'

export const startUserMonitorAndCloseModals = () => (dispatch) => {
  userMonitorService.start()
  dispatch(modalsClose())
}

export const stopUserMonitor = () => () => {
  userMonitorService.stop()
}

export const removeWatchersUserMonitor = () => () => {
  userMonitorService
    .removeAllListeners('active')
    .stop()
}

export const watchInitUserMonitor = () => (dispatch) => {
  userMonitorService
    .on('active', () => dispatch(modalsOpen({
      componentName: 'UserActiveDialog',
    })))
    .start()
}

export const changeMomentLocale = (locale) => (dispatch) => {
  moment.locale(locale)
  localStorage.setLocale(locale)
  dispatch(setLocale(locale))
}

export const download = (hash, name) => async () => {
  // do nt limit a time to download
  const data = await ipfs.get(hash, 100000)
  const ref = document.createElement('a')
  ref.href = data.content
  if (name) {
    ref.download = name
  }
  document.body.appendChild(ref)
  ref.click()
  document.body.removeChild(ref)
}

export const changeWalletView = () => (dispatch) => {
  dispatch({ type: CHANGE_WALLET_VIEW })
}
