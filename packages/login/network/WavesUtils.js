/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { WavesEngine } from './WavesEngine'

// eslint-disable-next-line import/prefer-default-export
export function createWAVESEngine (wallet, network) {
  return new WavesEngine(wallet, network)
}
