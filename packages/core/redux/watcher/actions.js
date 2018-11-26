/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { watchInitMonitor } from '@chronobank/login/redux/monitor/actions'
import { startMarket } from '@chronobank/market/middleware/thunks'
import { watchInitTokens, watchPlatformManager } from '../assetsManager/actions'
import { watchEventsToHistory } from '../events/actions'
import { initDAOs } from '../daos/actions'
import { initProviders } from '../providers/thunks'
import { watchInitPolls } from '../voting/thunks'
import { initMultisigWalletManager } from '../multisigWallet/actions'
import { WATCHER } from './constants'
import { enableDefaultBlockchains } from '../persistAccount/actions'
import { initTokenSubscription } from '../wallets/actions'

// for all users on all pages
export const globalWatcher = () => async (dispatch) => {
  dispatch(watchInitMonitor())
}

// for all logged in users
export const watcher = ({ web3 }) => async (dispatch) => {
  try {
    await dispatch(initDAOs({ web3 }))
    dispatch(initProviders())
    dispatch(initMultisigWalletManager())
    dispatch(initTokenSubscription())
    await dispatch(enableDefaultBlockchains())
    dispatch(watchPlatformManager())
    dispatch(watchInitTokens())
    dispatch(watchInitMonitor())
    dispatch(startMarket())
    dispatch(watchInitPolls())
    dispatch(watchEventsToHistory())
    dispatch({ type: WATCHER })
  } catch (e) {
    console.log('Watcher error: ', e)
  }
}
