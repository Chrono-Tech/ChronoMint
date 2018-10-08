/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import assetsHolder from './assetsHolder/reducer'
import assetsManager from './assetsManager/reducer'
import bitcoin from './bitcoin/reducer'
import dao from './daos/reducer'
import device from './device/reducer'
import ethereum from './ethereum/reducer'
import ethMultisigWallet from './multisigWallet/reducer'
import events from './events/reducer'
import mainWallet from './mainWallet/reducer'
import market from './market/reducer'
import modals from './modals/reducer'
import nem from './nem/reducer'
import notifier from './notifier/reducer'
// persistAccount reduxer configuring separately in configureStore for peristance
// import persistAccount from './persistAccount/reducer'
import profile from './profile/reducer'
import rewards from './rewards/reducer'
import session from './session/reducer'
import settingsErc20Tokens from './settings/erc20/tokens/reducer'
import tokens from './tokens/reducer'
import voting from './voting/reducer'
import wallet from './wallet/reducer'
// wallets reducer configuring separately in configureStore for peristance
// import wallets from './wallets/reducer'
import watcher from './watcher/reducer'
import waves from './waves/reducer'

const coreReducers = {
  assetsHolder,
  assetsManager,
  bitcoin,
  dao,
  device,
  ethereum,
  ethMultisigWallet,
  events,
  mainWallet,
  market,
  modals,
  nem,
  notifier,
  // persistAccount reduxer configuring separately in configureStore for peristance
  // persistAccount,
  profile,
  rewards,
  session,
  settingsErc20Tokens,
  tokens,
  voting,
  wallet,
  // wallets reducer configuring separately in configureStore for peristance
  // wallets,
  watcher,
  waves,
}

export default coreReducers
