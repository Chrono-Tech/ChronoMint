/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import hdkey from 'ethereumjs-wallet/hdkey'
import Accounts from 'web3-eth-accounts'

const DEFAULT_PATH = "m/44'/60'/0'/0"
const DEFAULT_PATH_FACTORY = (index) => `${DEFAULT_PATH}/${index}`
const MOCK_SEED = 'advice shed boat scan game expire reveal rapid concert settle before vital'

export default class EthereumLedgerDeviceMock {
  get name () {
    return 'ledger_mock'
  }

  get title () {
    return 'Ledger Device Mock'
  }

  async getAddressInfoList (from: number = 0, limit: number = 5): String {
    return Array.from({ length: limit }).map((element, index) => {
      return this.getAddressInfo(DEFAULT_PATH_FACTORY(from + index), from + index)
    })
  }

  getAddressInfo (path, accountIndex) {
    const hdKey = hdkey.fromMasterSeed(MOCK_SEED)
    const wallet = hdKey.derivePath(path).getWallet()

    return {
      path: path,
      address: `0x${wallet.getAddress().toString('hex')}`,
      publicKey: wallet.getPublicKey().toString('hex'),
      type: this.name,
      accountIndex,
    }
  }

  getAddress () {
    const hdKey = hdkey.fromMasterSeed(MOCK_SEED)
    const wallet = hdKey.derivePath(DEFAULT_PATH).getWallet()
    return `0x${wallet.getAddress().toString('hex')}`
  }

  async signTransaction (txData, path) {
    const accounts = new Accounts()
    const hdWallet = hdkey.fromMasterSeed(MOCK_SEED).derivePath(path)
    const wallet = hdWallet.getWallet()
    const account = await accounts.privateKeyToAccount(`0x${wallet.getPrivateKey().toString('hex')}`)
    const signedTransaction = await account.signTransaction(txData)

    return signedTransaction
  }

  async signData (data, path) {
    const accounts = new Accounts()
    const hdWallet = hdkey.fromMasterSeed(MOCK_SEED).derivePath(path)
    const w = hdWallet.getWallet()
    const account = await accounts.privateKeyToAccount(`0x${w.getPrivateKey().toString('hex')}`)
    const signedData = await account.sign(data)

    return signedData
  }
}
