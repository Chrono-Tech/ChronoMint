/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { watchInitMonitor } from '@chronobank/login/redux/monitor/actions'
import { watchInitUserMonitor } from '@chronobank/core-dependencies/redux/ui/actions'
import { watchInitTokens, watchPlatformManager } from '../assetsManager/actions'
import { initMainWallet } from '../mainWallet/actions'
import { watchInitMarket } from '../market/actions'
import { initTokens } from '../tokens/actions'
import { initDAOs } from '../daos/actions'
import { watchInitPolls } from '../voting/actions'
import { initMultisigWalletManager } from '../multisigWallet/actions'
import { initWallets } from '../wallets/actions'
import { WATCHER } from './constants'

// for all users on all pages
export const globalWatcher = () => async (dispatch) => {
  dispatch(watchInitMonitor())
}

// for all logged in users
export const watcher = ({ web3 }) => async (dispatch) => {
  await dispatch(initDAOs({ web3 }))
  dispatch(initMultisigWalletManager())
  dispatch(initTokens())
  dispatch(initMainWallet())
  dispatch(initWallets())
  dispatch(watchPlatformManager())
  dispatch(watchInitTokens())
  dispatch(watchInitMonitor())
  dispatch(watchInitUserMonitor())
  dispatch(watchInitMarket())
  dispatch(watchInitPolls())
  dispatch({ type: WATCHER })
}
