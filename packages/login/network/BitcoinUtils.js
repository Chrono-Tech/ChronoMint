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
