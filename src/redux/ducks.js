import Login from 'Login/redux/ducks'
import * as drawer from './drawer/'
import * as exchange from './exchange/'
import * as locs from './locs/'
import * as market from './market/'
import * as modals from './modals/'
import * as monitor from './monitor/'
import * as notifier from './notifier/'
import * as operations from './operations/'
import * as rewards from './rewards/'
import * as session from './session/'
import * as settings from './settings/'
import * as ui from './ui/'
import * as voting from './voting/'
import * as wallet from './wallet/'
import * as watcher from './watcher/'

export default {
  ui,
  modals,
  drawer,
  session,
  locs,
  voting,
  wallet,
  rewards,
  exchange,
  settings,
  notifier,
  operations,
  watcher,
  market,
  monitor,
  ...Login,
}
