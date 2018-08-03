/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { watchInitMonitor } from '@chronobank/login/redux/monitor/actions'
import { showConfirmTxModal, watchInitUserMonitor } from '@chronobank/core-dependencies/redux/ui/actions'
import AbstractContractDAO from '../../dao/AbstractContractDAO'
import { TX_FRONTEND_ERROR_CODES } from '../../dao/constants'
import TransactionErrorNoticeModel from '../../models/notices/TransactionErrorNoticeModel'
import TxError from '../../models/TxError'
import type TxExecModel from '../../models/TxExecModel'
import { watchPlatformManager } from '../assetsManager/actions'
import { watchInitLOC } from '../locs/actions'
import { initMainWallet } from '../mainWallet/actions'
import { watchInitMarket } from '../market/actions'
import { notify } from '../notifier/actions'
import { watchInitOperations } from '../operations/actions'
import { watchInitCBE } from '../settings/user/cbe/actions'
import { initTokens } from '../tokens/actions'
import { initDAOs } from '../daos/actions'
import { watchInitPolls } from '../voting/actions'
import { watchInitProfile } from '../session/actions'
import { initMultisigWalletManager } from '../multisigWallet/actions'
import { initWallets } from '../wallets/actions'
import {
  WATCHER_CBE,
  WATCHER_TX_SET,
  WATCHER_TX_END,
  WATCHER,
} from './constants'

export const txHandlingFlow = () => (dispatch) => {
  AbstractContractDAO.txStart = async (tx: TxExecModel, estimateGas, localFeeMultiplier) => {
    dispatch({ type: WATCHER_TX_SET, tx })

    const { isConfirmed, updatedTx } = await dispatch(showConfirmTxModal(estimateGas, localFeeMultiplier))
    if (!isConfirmed) {
      throw new TxError('Cancelled by user from custom tx confirmation modal', TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED)
    }

    // uncomment code below if you want to simulate prolongation of tx mining
    // const sleep = (seconds) => {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve()
    //     }, seconds * 1000)
    //   })
    // }
    // const seconds = 10
    // console.warn('Simulated ' + seconds + ' seconds prolongation of tx mining')
    // await sleep(seconds)
    return updatedTx
  }

  AbstractContractDAO.txGas = (tx: TxExecModel) => {
    dispatch({ type: WATCHER_TX_SET, tx })
  }

  AbstractContractDAO.txEnd = (tx: TxExecModel, e: ?TxError = null) => {
    dispatch({ type: WATCHER_TX_END, tx })

    if (e && e.codeValue !== TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED) {
      dispatch(notify(new TransactionErrorNoticeModel(tx, e)))
    }
  }
}

// for all users on all pages
export const globalWatcher = () => async (dispatch) => {
  dispatch(watchInitMonitor())
}

// for all logged in users
export const watcher = ({ web3 }) => async (dispatch) => {
  await dispatch(initDAOs({ web3 }))
  dispatch(initMultisigWalletManager())
  dispatch(watchInitProfile())
  dispatch(initTokens())
  dispatch(initMainWallet())
  dispatch(initWallets())
  dispatch(watchPlatformManager())
  dispatch(watchInitTokens())
  dispatch(watchInitMonitor())
  dispatch(watchInitUserMonitor())
  dispatch(watchInitMarket())
  // TODO @Abdulov fix it
  // dispatch(watchInitERC20Tokens())
  dispatch(watchInitPolls())
  dispatch(txHandlingFlow())
  dispatch({ type: WATCHER })
}

// only for CBE
export const cbeWatcher = () => async (dispatch) => {
  dispatch({ type: WATCHER_CBE })
  // settings
  dispatch(watchInitCBE())
  dispatch(watchInitLOC())
  dispatch(watchInitOperations())
}
