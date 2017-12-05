import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import hdKey from 'ethereumjs-wallet/hdkey'
import { createBCCEngine, createBTCEngine, createLTCEngine, createBTGEngine } from './BitcoinUtils'
import EthereumEngine from './EthereumEngine'
import * as NEM from './nem'
import { createNEMEngine } from './NemUtils'
import NemWallet from './NemWallet'

class MnemonicProvider {
  getMnemonicProvider (mnemonic, { url, network } = {}) {
    const ethereumWallet = this.createEthereumWallet(mnemonic, network, url)
    const btc = network && network.bitcoin && this.createBitcoinWallet(mnemonic, bitcoin.networks[network.bitcoin])
    const bcc = network && network.bitcoinCash && this.createBitcoinWallet(mnemonic, bitcoin.networks[network.bitcoinCash])
    const btg = network && network.bitcoinGold && this.createBitcoinGoldWallet(mnemonic, bitcoin.networks[network.bitcoinGold])
    const ltc = network && network.litecoin && this.createLitecoinWallet(mnemonic, bitcoin.networks[network.litecoin])
    const nem = network && network.nem && NemWallet.fromMnemonic(mnemonic, NEM.Network.data[network.nem])

    return {
      ethereum: new EthereumEngine(ethereumWallet, network, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[network.bitcoin]),
      bcc: network && network.bitcoinCash && createBCCEngine(bcc, bitcoin.networks[network.bitcoinCash]),
      btg: network && network.bitcoinGold && createBTGEngine(btg, bitcoin.networks[network.bitcoinGold]),
      ltc: network && network.litecoin && createLTCEngine(ltc, bitcoin.networks[network.litecoin]),
      nem: network && network.nem && createNEMEngine(nem, NEM.Network.data[network.nem]),
    }
  }

  createEthereumWallet (mnemonic) {
    const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    // get the first account using the standard hd path
    const walletHDPath = `m/44'/60'/0'/0/0`
    return hdWallet.derivePath(walletHDPath).getWallet()
  }

  createBitcoinWallet (mnemonic, network) {
    return bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), network)
      .derivePath(`m/44'/${network === bitcoin.networks.testnet ? 1 : 0}'/0'/0/0`)
  }

  createLitecoinWallet (mnemonic, network) {
    // coin_types 8 and 9 used, but they are not standardized
    return bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), network)
      .derivePath(`m/44'/${network === bitcoin.networks.litecoin_testnet ? 8 : 9}'/0'/0/0`)
  }

  createBitcoinGoldWallet (mnemonic, network) {
    // coin_types 16 and 17 used, but they are not standardized
    return bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), network)
      .derivePath(`m/44'/${network === bitcoin.networks.bitcoingold_testnet ? 16 : 17}'/0'/0/0`)
  }

  validateMnemonic (mnemonic) {
    return bip39.validateMnemonic(mnemonic)
  }

  generateMnemonic () {
    return bip39.generateMnemonic()
  }
}

export default new MnemonicProvider()
