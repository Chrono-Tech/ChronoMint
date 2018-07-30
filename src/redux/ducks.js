/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Core from '@chronobank/core/redux/ducks'
import Login from '@chronobank/login/redux/ducks'
import * as drawer from './drawer'
import * as modals from './modals'
import * as sides from './sides'
import * as ui from './ui'

export default {
  ...Core,
  ...Login,
  drawer,
  modals,
  sides,
  ui,
}
