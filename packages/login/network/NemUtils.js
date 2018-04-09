/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { NemEngine } from './NemEngine'

// eslint-disable-next-line import/prefer-default-export
export function createNEMEngine (wallet, network) {
  return new NemEngine(wallet, network)
}
