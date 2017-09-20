import { BTCEngine, BCCEngine } from './BitcoinEngine'

export function createBTCEngine (wallet, network) {
  return new BTCEngine(wallet, network)
}

export function createBCCEngine (wallet, network) {
  // TODO @ipavlenko: Prevent BCC instantiation on testnet
  return new BCCEngine(wallet, network)
}
