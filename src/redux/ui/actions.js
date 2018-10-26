/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import { setLocale } from 'react-redux-i18n'
import { MODALS_OPEN } from '@chronobank/core/redux/modals/constants'
import localStorage from 'utils/LocalStorage'
import ipfs from '@chronobank/core/utils/IPFS'
import {
  CHANGE_WALLET_VIEW,
  SET_VISIBLE_COOKIES_BAR,
} from './constants'

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

export const changeWalletView = () => ({ type: CHANGE_WALLET_VIEW })

export const showTurnOffPopup = () => {
  return {
    type: MODALS_OPEN,
    componentName: 'TurnOffBlockchain',
  }
}

export const setVisibleCookiesBar = (isCookiesBarVisible) => ({
  type: SET_VISIBLE_COOKIES_BAR,
  isCookiesBarVisible,
})
