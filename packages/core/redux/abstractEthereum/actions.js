/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  NONCE_UPDATE,
} from './constants'

export const nonceUpdate = (blockchain) => (address, nonce) => ({
  type: NONCE_UPDATE,
  address,
  blockchain,
  nonce,
})
