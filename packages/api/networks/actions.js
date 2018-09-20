/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { NETSET_SWITCH } from './constants'

// eslint-disable-next-line import/prefer-default-export
export const switchNetwork = (networkIndex) => ({
  type: NETSET_SWITCH,
  networkIndex,
})
