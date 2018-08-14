import EventEmitter from 'events'
import EthereumTx from 'ethereumjs-tx'
import hdkey from 'ethereumjs-wallet/hdkey'
const stripHexPrefix = require('strip-hex-prefix')
const BigNumber = require('bignumber.js')
import Accounts from 'web3-eth-accounts'
const DEFAULT_PATH = "m/44'/60'/0'/0"
const DEFAULT_PATH_FACTORY = (index) => `${DEFAULT_PATH}/${index}`
const MOCK_SEED = "advice shed boat scan game expire reveal rapid concert settle before vital" 

export default class LedgerDeviceMock extends EventEmitter {
  get name () {
    return 'ledger_mock'
  }

  get title () {
    return 'Ledger Device Mock'
  }

  async init () {
    const hdWallet = hdkey.fromMasterSeed(MOCK_SEED)
    const xpub = hdWallet.publicExtendedKey() 
    this.xpubkey = xpub
    const wallet = hdkey.fromExtendedKey(this.xpubkey).getWallet()
    this.emit('connected')
    return {
          path: DEFAULT_PATH,
          address: wallet.getAddress().toString('hex'),
          publicKey: wallet.getPublicKey(),
	  type: this.name,
    }
  }

  stripAndPad (str) {
    if (str !== undefined) {
      const stripped = stripHexPrefix(str)
      return stripped.length % 2 === 0 ? stripped : '0' + stripped
    }
    return null
  }

  get isConnected () {
    return !!this.xpubkey
  }

  async getAddressInfoList (from: Number = 0, limit: Number = 5): String {
    if (this.isConnected) {
      const hdKey = hdkey.fromExtendedKey(this.xpubkey)
      return Array.from({ length: limit }).map((element, index) => {
        const wallet = hdKey.deriveChild(from + index).getWallet()
        return {
          path: DEFAULT_PATH_FACTORY(index),
          address: `0x${wallet.getAddress().toString('hex')}`,
          publicKey: wallet.getPublicKey().toString('hex')
        }
      })
    }
    return []
  }

  async signTransaction (path, txData) {
    const accounts = new Accounts()
    const hdWallet = hdkey.fromMasterSeed(MOCK_SEED)
    const wallet = hdWallet.getWallet()
    const account = await accounts.privateKeyToAccount(`0x${wallet.getPrivateKey().toString('hex')}`)
    return await account.signTransaction(txData)
  }

  async signData (path, data) {
    const accounts = new Accounts()
    const hdWallet = hdkey.fromMasterSeed(MOCK_SEED)
    const w = hdWallet.derivePath(DEFAULT_PATH).getWallet()
    const account = await accounts.privateKeyToAccount(`0x${w.getPrivateKey().toString('hex')}`)
    return await account.sign(data)
  }
}
