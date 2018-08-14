/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import hdKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import Accounts from 'web3-eth-accounts'
import SignerModel from './SignerModel'

export default class SignerMemoryModel extends SignerModel {
  constructor ({ wallet }) {
    super()
    this.wallet = wallet[0]
    Object.freeze(this)
  }

  get address () {
    return this.wallet.address
  }

  get privateKey () {
    return this.wallet.privateKey
  }

  // this method is a part of base interface
  getAddress (path) {
    if(!path)
      return this.address
    else 
      return this.getDerivedWallet(this.wallet.privateKey, path).address
  }

  async signTransaction (tx, path) { // tx object
    if(!path)
      return this.wallet.signTransaction(tx)
    else 
      return this.getDerivedWallet(this.wallet.privateKey, path).signTransaction(tx)
  }

  async signData (data) { // data object
    return this.wallet.sign(data)
  }

  // Should be synchronous by design
  encrypt (password) {
    return this.wallet.encrypt(password)
  }

  static async create ({ seed, privateKey, mnemonic, numbeOfAccounts }) {
    const accounts = new Accounts()
    const wallet = accounts.wallet.create(numbeOfAccounts)
    if (privateKey) {
      const account = await accounts.privateKeyToAccount(`0x${privateKey}`)
      await wallet.add(account)
    }
    if (seed) {
      const hdWallet = hdKey.fromMasterSeed(seed)
      const w = hdWallet.derivePath(`m/44'/60'/0'/0/0`).getWallet()
      const account = await accounts.privateKeyToAccount(`0x${w.getPrivateKey().toString('hex')}`)
      await wallet.add(account)
    }
    if (mnemonic) {
      const seed = bip39.mnemonicToSeed(mnemonic)
      const hdWallet = hdKey.fromMasterSeed(seed)
      const w = hdWallet.derivePath(`m/44'/60'/0'/0/0`).getWallet()
      const account = await accounts.privateKeyToAccount(`0x${w.getPrivateKey().toString('hex')}`)
      await wallet.add(account)
    } 
    console.log(wallet)
    return new SignerMemoryModel({ wallet })
  }

  // Should be synchronous by design
  static decrypt ({ entry, password }) {
    const accounts = new Accounts()
    const wallet = accounts.wallet.decrypt(entry.encrypted, password)
    return new SignerMemoryModel({ wallet })
  }

  getDerivedWallet ({ seed, derivedPath }) {
    const hdWallet = hdKey.fromMasterSeed(seed)
    const wallet = hdWallet.derivePath(derivedPath).getWallet()
    const newSeed = Buffer.from(wallet.getPrivateKey()).toString('hex')
    return SignerMemoryModel.create({ seed: newSeed })
  }
}
