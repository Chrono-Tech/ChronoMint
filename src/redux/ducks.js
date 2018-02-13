import Login from '@chronobank/login/redux/ducks'
import * as assetsManager from './assetsManager'
import * as drawer from './drawer'
import * as exchange from './exchange'
import * as locs from './locs'
import * as mainWallet from './mainWallet'
import * as market from './market'
import * as modals from './modals'
import * as sides from './sides'
import * as multisigWallet from './multisigWallet'
import * as notifier from './notifier'
import * as operations from './operations'
import * as rewards from './rewards'
import * as session from './session'
import * as settings from './settings'
import * as ui from './ui'
import * as voting from './voting'
import * as wallet from './wallet'
import * as watcher from './watcher'
import * as tokens from './tokens'
import * as assetsHolder from './assetsHolder'

export default {
  ui,
  modals,
  sides,
  drawer,
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
  ...Login,
}
