import NemEngine from './NemEngine'

// eslint-disable-next-line import/prefer-default-export
export function createNEMEngine (wallet, network) {
  return new NemEngine(wallet, network)
}
