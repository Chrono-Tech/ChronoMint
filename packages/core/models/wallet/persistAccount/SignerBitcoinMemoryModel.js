/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import hdKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import Accounts from 'web3-eth-accounts'
import SignerModel from './SignerModel'
import bitcoin from 'bitcoinjs-lib'
import bigi from 'bigi'

export default class SignerBitcoinMemoryModel extends SignerModel {
  constructor ({ wallet }) {
    super()
    this.wallet = wallet
    Object.freeze(this)
  }

  get address () {
    return this.wallet.address
  }

  get privateKey () {
    return this.wallet.privateKey
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

  static async create ({ seed, privateKey, mnemonic }) {
  //TODO add network checker
    const network = bitcoin.networks.mainnet
    console.log(privateKey)
    const keyPair = new bitcoin.ECPair(bigi.fromBuffer(Buffer.from(privateKey.substring(2), 'hex')), null, {
      network
    })
    const wallet = {
      keyPair,
      getNetwork () {
        return keyPair.getNetwork()
      },
      getAddress () {
        return keyPair.getAddress()
      },
    }
    console.log(wallet)
    return new SignerBitcoinMemoryModel({ wallet })
  }

}
