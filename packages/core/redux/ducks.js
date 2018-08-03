/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'

import assetsHolder from './assetsHolder/reducer'
import assetsManager from './assetsManager/reducer'
import dao from './daos/reducer'
import ethMultisigWallet from './multisigWallet/reducer'
import exchange from './exchange/reducer'
import locs from './locs/reducer'
import mainWallet from './mainWallet/reducer'
import market from './market/reducer'
import notifier from './notifier/reducer'
import operations from './operations/reducer'
import persistAccount from './persistAccount/reducer'
import rewards from './rewards/reducer'
import session from './session/reducer'
import settingsErc20Tokens from './settings/erc20/tokens/reducer'
import settingsUserCBE from './settings/user/cbe/reducer'
import tokens from './tokens/reducer'
import transactions from './transactions/reducer'
import voting from './voting/reducer'
import wallet from './wallet/reducer'
import wallets from './wallets/reducer'
import watcher from './watcher/reducer'
import web3 from './web3/reducer'

const coreReducers = {
  assetsHolder,
  assetsManager,
  dao,
  ethMultisigWallet,
  exchange,
  locs,
  mainWallet,
  market,
  notifier,
  operations,
  persistAccount,
  rewards,
  session,
  settingsErc20Tokens,
  settingsUserCBE,
  tokens,
  transactions,
  voting,
  wallet,
  wallets,
  watcher,
  web3,
}

export default coreReducers

// for further development
export const combinedCoreReducers = combineReducers(coreReducers)
