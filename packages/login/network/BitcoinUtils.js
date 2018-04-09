/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BCCEngine, BTCEngine, BTGEngine, LTCEngine } from './BitcoinEngine'

export function createBTCEngine (wallet, network) {
  return new BTCEngine(wallet, network)
}

export function createBCCEngine (wallet, network) {
  return new BCCEngine(wallet, network)
}

export function createBTGEngine (wallet, network) {
  return new BTGEngine(wallet, network)
}

export function createLTCEngine (wallet, network) {
  return new LTCEngine(wallet, network)
}
