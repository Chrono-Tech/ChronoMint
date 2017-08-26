import BitcoinEngine from './BitcoinEngine'

class BitcoinUtils {
  createEngine (wallet, providerUrl) {
    return new BitcoinEngine(wallet, providerUrl)
  }
}

export default new BitcoinUtils()
