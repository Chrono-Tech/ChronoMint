/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import { setLocale } from '@chronobank/core-dependencies/i18n'
import ls from '@chronobank/core-dependencies/utils/LocalStorage'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import userMonitorService from 'user/monitorService'
import { modalsOpen } from 'redux/modals/actions'
import { DUCK_WATCHER, WATCHER_TX_SET } from '@chronobank/core/redux/watcher/constants'
import ConfirmTxDialog from 'components/dialogs/ConfirmTxDialog/ConfirmTxDialog'
import UserActiveDialog from 'components/dialogs/UserActiveDialog/UserActiveDialog'
import { CHANGE_WALLET_VIEW, OPEN_BRAND_PARTIAL } from './constants'
import ConfirmTransferDialog from '../../components/dialogs/ConfirmTransferDialog/ConfirmTransferDialog'

export const removeWatchersUserMonitor = () => () => {
  userMonitorService
    .removeAllListeners('active')
    .stop()
}

export const watchInitUserMonitor = () => (dispatch) => {
  userMonitorService
    .on('active', () => dispatch(modalsOpen({ component: UserActiveDialog })))
    .start()
}

export const showConfirmTransferModal = (dao, tx) => (dispatch) => {
  dispatch(modalsOpen({
    component: ConfirmTransferDialog,
    props: {
      tx,
      dao,
      confirm: (tx) => dao.accept(tx),
      reject: (tx) => dao.reject(tx),
    },
  }))
}

// TODO @ipavlenko: Do not use promise, use emitter, see showConfirmTransferModal
export const showConfirmTxModal = (estimateGas, localFeeMultiplier) => (dispatch, getState) => new Promise((resolve) => {
  dispatch(modalsOpen({
    component: ConfirmTxDialog,
    props: {
      callback: (isConfirmed, tx) => resolve({ isConfirmed, updatedTx: tx }),
      localFeeMultiplier,
      handleEstimateGas: async (func, args, value, gasPriceMultiplier = 1) => {
        if (!estimateGas) {
          return
        }
        const { gasFee, gasLimit, gasPrice } = await estimateGas(func, args, value)
        let tx = getState().get(DUCK_WATCHER).confirmTx
        tx = tx
          .gasPrice(gasPrice.mul(gasPriceMultiplier))
          .setGas(gasFee.mul(gasPriceMultiplier))
          .gasLimit(gasLimit)
        dispatch({ type: WATCHER_TX_SET, tx })
      },
    },
  }))
}).catch((e) => {
  // eslint-disable-next-line
  console.error('Confirm modal error:', e)
  return { isConfirmed: false }
})

export const changeMomentLocale = (locale) => (dispatch) => {
  moment.locale(locale)
  ls.setLocale(locale)
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

export const deleteCustomNetwork = (network) => (dispatch, getState) => {
  const state = getState()


}

export const openBrandPartial = (open) => (dispatch) => {
  dispatch({
    type: OPEN_BRAND_PARTIAL,
    payload: { open },
  })
}
