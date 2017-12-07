import { initTokens } from 'redux/tokens/actions'
import AbstractContractDAO, { TX_FRONTEND_ERROR_CODES, TxError } from 'dao/AbstractContractDAO'
import { watchInitMonitor } from 'Login/redux/monitor/actions'
import TransactionErrorNoticeModel from 'models/notices/TransactionErrorNoticeModel'
import type TxExecModel from 'models/TxExecModel'
import { watchInitTokens, watchPlatformManager } from 'redux/assetsManager/actions'
import { watchInitLOC } from 'redux/locs/actions'
import { balanceMinus, balancePlus, DUCK_MAIN_WALLET, ETH, watchInitWallet, watchInitWallet2 } from 'redux/mainWallet/actions'
import { watchInitMarket } from 'redux/market/action'
import { notify } from 'redux/notifier/actions'
import { watchInitOperations } from 'redux/operations/actions'
import { watchInitERC20Tokens } from 'redux/settings/erc20/tokens/actions'
import { watchInitCBE } from 'redux/settings/user/cbe/actions'
import { showConfirmTxModal } from 'redux/ui/modal'
import { watchInitUserMonitor } from 'redux/userMonitor/actions'
import { watchInitPolls } from 'redux/voting/actions'

export const DUCK_WATCHER = 'watcher'

// next two actions represents start of the events watching
export const WATCHER = 'watcher/USER'
export const WATCHER_CBE = 'watcher/CBE'

export const WATCHER_TX_SET = 'watcher/TX_SET'
export const WATCHER_TX_END = 'watcher/TX_END'

export const txHandlingFlow = () => (dispatch, getState) => {
  AbstractContractDAO.txStart = async (tx: TxExecModel) => {
    dispatch({ type: WATCHER_TX_SET, tx })

    const isConfirmed = await dispatch(showConfirmTxModal())
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
  }

  AbstractContractDAO.txGas = (tx: TxExecModel) => {
    const token = getState().get(DUCK_MAIN_WALLET).tokens().get(ETH)
    dispatch(balanceMinus(tx.gas(), token))
    dispatch({ type: WATCHER_TX_SET, tx })
  }

  AbstractContractDAO.txEnd = (tx: TxExecModel, e: ?TxError = null) => {
    dispatch({ type: WATCHER_TX_END, tx })
    const token = getState().get(DUCK_MAIN_WALLET).tokens().get(ETH)

    if (!tx.isGasUsed()) {
      dispatch(balancePlus(tx.gas(), token))
    } else {
      dispatch(balancePlus(tx.estimateGasLaxity(), token))
    }

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
export const watcher = () => async (dispatch) => {
  dispatch(initTokens())
  dispatch(watchPlatformManager())
  dispatch(watchInitTokens())
  dispatch(watchInitMonitor())
  dispatch(watchInitUserMonitor())
  dispatch(watchInitMarket())
  // TODO @dkchv: !!! restore
  dispatch(watchInitWallet())
  // dispatch(watchInitWallet2())
  // dispatch(initWalletManager())
  dispatch(watchInitERC20Tokens())
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