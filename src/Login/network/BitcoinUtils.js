import { BCCEngine, BTCEngine } from './BitcoinEngine'

export function createBTCEngine (wallet, network) {
  return new BTCEngine(wallet, network)
}

export function createBCCEngine (wallet, network) {
  return new BCCEngine(wallet, network)
}
