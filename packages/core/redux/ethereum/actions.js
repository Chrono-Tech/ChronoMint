/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  WEB3_UPDATE,
} from './constants'

export const ethWeb3Update = (web3) => ({
  type: WEB3_UPDATE,
  web3,
})
