/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as assetsHolder from './assetsHolder'
import * as assetsManager from './assetsManager'
import * as exchange from './exchange'
import * as locs from './locs'
import * as mainWallet from './mainWallet'
import * as market from './market'
import * as multisigWallet from './multisigWallet'
import * as notifier from './notifier'
import * as operations from './operations'
import * as rewards from './rewards'
import * as session from './session'
import * as settings from './settings'
import * as tokens from './tokens'
import * as voting from './voting'
import * as wallet from './wallet'
import * as watcher from './watcher'
import * as persistAccount from './persistAccount'
import * as web3 from './web3'
import * as dao from '../refactor/redux/daos'
import * as transactions from '../refactor/redux/transactions'
import * as wallets from './wallets'

export default {
  session,
  locs,
  voting,
  wallet,
  mainWallet,
  multisigWallet,
  rewards,
  exchange,
  settings,
  notifier,
  operations,
  watcher,
  market,
  assetsManager,
  tokens,
  assetsHolder,
  persistAccount,
  web3,
  dao,
  transactions,
  wallets,
}
