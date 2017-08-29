import BitcoinEngine from './BitcoinEngine'

class BitcoinUtils {
  createEngine (wallet, network) {
    return new BitcoinEngine(wallet, network)
  }
}

export default new BitcoinUtils()
