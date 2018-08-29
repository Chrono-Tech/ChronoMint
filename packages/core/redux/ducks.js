/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'

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
import nem from './nem/reducer'
import notifier from './notifier/reducer'
import persistAccount from './persistAccount/reducer'
import profile from './profile/reducer'
import rewards from './rewards/reducer'
import session from './session/reducer'
import settingsErc20Tokens from './settings/erc20/tokens/reducer'
import tokens from './tokens/reducer'
import voting from './voting/reducer'
import wallet from './wallet/reducer'
import wallets from './wallets/reducer'
import watcher from './watcher/reducer'

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
  nem,
  notifier,
  persistAccount,
  profile,
  rewards,
  session,
  settingsErc20Tokens,
  tokens,
  voting,
  wallet,
  wallets,
  watcher,
}

export default coreReducers

// for further development
export const combinedCoreReducers = combineReducers(coreReducers)
