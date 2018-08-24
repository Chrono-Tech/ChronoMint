import EventEmitter from 'events'
import hdkey from 'ethereumjs-wallet/hdkey'
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

 async getAddressInfoList (from: Number = 0, limit: Number = 5): String {
    return Array.from({ length: limit }).map((element, index) => {
      return this.getAddressInfo(DEFAULT_PATH_FACTORY(from + index))
      })
  }

  getAddressInfo (path) {
    console.log(path)
    const hdKey = hdkey.fromMasterSeed(MOCK_SEED)
     const wallet = hdKey.derivePath(path).getWallet()
        return {
          path: path,
          address: `0x${wallet.getAddress().toString('hex')}`,
          publicKey: wallet.getPublicKey().toString('hex'),
          type: this.name,
        }
  }

  getAddress (path) {
    if (this.isConnected) {
      const hdKey = hdkey.fromMasterSeed(MOCK_SEED)
      const wallet = hdKey.derivePath(path).getWallet()
        return `0x${wallet.getAddress().toString('hex')}`
    }
    return
  }

  async signTransaction (txData, path) {
    const accounts = new Accounts()
    const hdWallet = hdkey.fromMasterSeed(MOCK_SEED).derivePath(path)
    const wallet = hdWallet.getWallet()
    const account = await accounts.privateKeyToAccount(`0x${wallet.getPrivateKey().toString('hex')}`)
    return await account.signTransaction(txData)
  }

  async signData (data, path) {
    const accounts = new Accounts()
    const hdWallet = hdkey.fromMasterSeed(MOCK_SEED).derivePath(path)
    const w = hdWallet.getWallet()
    const account = await accounts.privateKeyToAccount(`0x${w.getPrivateKey().toString('hex')}`)
    return await account.sign(data)
  }
}
