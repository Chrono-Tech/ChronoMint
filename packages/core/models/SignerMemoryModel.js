/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import hdKey from 'ethereumjs-wallet/hdkey'

const bip39 = require('bip39')
const Accounts = require('web3-eth-accounts')
const SignerModel = require('./SignerModel')

module.exports = class SignerMemoryModel extends SignerModel {
  constructor ({ wallet }) {
    super()
    this.wallet = wallet
    Object.freeze(this)
  }

  get address () {
    return this.wallet[0].address
  }

  get privateKey () {
    return this.wallet[0].privateKey
  }

  // this method is a part of base interface
  getAddress () {
    return this.address
  }

  async signTransaction (tx) { // tx object
    return this.wallet[0].signTransaction(tx)
  }

  async signData (data) { // data object
    return this.wallet[0].sign(data)
  }

  // Should be synchronous by design
  encrypt (password) {
    return this.wallet.encrypt(password)
  }

  static async create ({ seed, mnemonic, numbeOfAccounts }) {
    const accounts = new Accounts()
    const wallet = accounts.wallet.create(numbeOfAccounts)
    if (seed) {
      const account = await accounts.privateKeyToAccount(`0x${seed}`)
      await wallet.add(account)
    }
    if (mnemonic) {
      const account = await accounts.privateKeyToAccount(`0x${bip39.mnemonicToSeedHex(mnemonic)}`)
      await wallet.add(account)
    }
    return new SignerMemoryModel({ wallet })
  }

  // Should be synchronous by design
  static decrypt ({ entry, password }) {
    const accounts = new Accounts()
    const wallet = accounts.wallet.decrypt(entry.encrypted, password)
    return new SignerMemoryModel({ wallet })
  }

  static fromDerivedPath ({ seed, derivedPath }) {
    const hdWallet = hdKey.fromMasterSeed(seed)
    const wallet = hdWallet.derivePath(derivedPath).getWallet()
    const newSeed = Buffer.from(wallet.getPrivateKey()).toString('hex')
    return SignerMemoryModel.create({ seed: newSeed })
  }
}
