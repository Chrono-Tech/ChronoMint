/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bip39 from 'bip39'
import EventEmitter from 'events'
import hdKey from 'ethereumjs-wallet/hdkey'
import Accounts from 'web3-eth-accounts'
import { WALLET_HD_PATH } from '@chronobank/login/network/constants'
import { WALLET_TYPE_MEMORY } from '../../models/constants/AccountEntryModel'

export const DEFAULT_PATH = `m/44'/60'/0'/0/0`

export default class EthereumMemoryDevice extends EventEmitter {

  constructor (privateKey) {
    super()
    const accounts = new Accounts()
    const wallet = accounts.wallet.create()
    wallet.add(accounts.privateKeyToAccount(privateKey))
    this.wallet = wallet[0]

    Object.freeze(this)
  }

  get address () {
    return this.wallet.address
  }

  getPrivateKey (path) {
    if (!path || path === DEFAULT_PATH) {
      return this.wallet.privateKey
    }

    return EthereumMemoryDevice.getDerivedWallet(this.wallet.privateKey, path).address
  }

  getAddress (path) {
    if (!path || path === DEFAULT_PATH) {
      return this.address.toLowerCase()
    }

    return EthereumMemoryDevice.getDerivedWallet(this.wallet.privateKey, path).address.toLowerCase()
  }

  async signTransaction (tx, path) {
    if (!path || path === DEFAULT_PATH) {
      return this.wallet.signTransaction(tx)
    }

    return EthereumMemoryDevice.getDerivedWallet(this.wallet.privateKey, path).signTransaction(tx)
  }

  async signData (data, path) {
    // data object
    if (!path || path === DEFAULT_PATH) {
      return this.wallet.sign(data)
    }

    return EthereumMemoryDevice.getDerivedWallet(this.wallet.privateKey, path).sign(data)
  }

  static create ({ privateKey, mnemonic, password }) {
    let account

    const accounts = new Accounts()
    const wallets = accounts.wallet.create()

    if (privateKey) {
      const hdWallet = hdKey.fromMasterSeed(Buffer.from(privateKey, 'hex'))
      const hdkey = hdWallet.derivePath(WALLET_HD_PATH)._hdkey
      account = accounts.privateKeyToAccount(`0x${hdkey._privateKey.toString('hex')}`)
    }

    if (mnemonic) {
      const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
      const hdkey = hdWallet.derivePath(WALLET_HD_PATH)._hdkey
      account = accounts.privateKeyToAccount(`0x${hdkey._privateKey.toString('hex')}`)
    }

    wallets.add(account)
    const wallet = wallets[0]

    return {
      wallet: wallet.encrypt(password),
      address: wallet.address.toLowerCase(),
      path: DEFAULT_PATH,
      type: WALLET_TYPE_MEMORY,
    }
  }

  // Should be synchronous by design
  static decrypt ({ entry, password }) {
    const accounts = new Accounts()
    const wallet = accounts.wallet.decrypt([entry], password)
    const privateKey = wallet[0].privateKey

    return privateKey
  }

  static getDerivedWallet (mnemonic: string, path: string) {
    const walletPath = !path ? DEFAULT_PATH : path
    const accounts = new Accounts()
    const wallet = accounts.wallet.create()

    const hdWallet = hdKey.fromMasterSeed(mnemonic)
    const w = hdWallet.derivePath(walletPath).getWallet()
    const account = accounts.privateKeyToAccount(`0x${w.getPrivateKey().toString('hex')}`)
    wallet.add(account)

    return wallet[0]
  }
}
