/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import { setLocale } from 'react-redux-i18n'
import ipfs from '@chronobank/core/utils/IPFS'
import { setPersistAccountLocale } from '@chronobank/core/redux/persistAccount/actions'
import { CHANGE_WALLET_VIEW } from './constants'

export const changeMomentLocale = (locale) => (dispatch) => {
  moment.locale(locale)
  dispatch(setLocale(locale))
  dispatch(setPersistAccountLocale(locale))
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
