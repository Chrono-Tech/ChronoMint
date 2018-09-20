/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { watchInitTokens, watchPlatformManager } from '../assetsManager/actions'
import { initMainWallet } from '../mainWallet/actions'
import { watchInitMarket } from '../market/actions'
import { watchEventsToHistory } from '../events/actions'
import { initTokens } from '../tokens/thunks'
import { initDAOs } from '../daos/actions'
import { initProviders } from '../providers/thunks'
import { watchInitPolls } from '../voting/thunks'
import { initMultisigWalletManager } from '../multisigWallet/actions'
import { initWallets } from '../wallets/actions'

// for all logged in users
// eslint-disable-next-line import/prefer-default-export
export const watcher = ({ web3 }) => async (dispatch) => {
  await dispatch(initDAOs({ web3 }))
  dispatch(initProviders())
  dispatch(initMultisigWalletManager())
  dispatch(initTokens())
  dispatch(initMainWallet())
  dispatch(initWallets())
  dispatch(watchPlatformManager())
  dispatch(watchInitTokens())
  dispatch(watchInitMarket())
  dispatch(watchInitPolls())
  dispatch(watchEventsToHistory())
}
