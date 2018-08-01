/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Tx from 'ethereumjs-tx'
import Web3 from 'web3'
import hdKey from 'ethereumjs-wallet/hdkey'
import Web3Utils from './Web3Utils'
import { WALLET_HD_PATH } from './constants'

export default class EthereumEngine {
  constructor (wallet, network, url, engine, deriveNumber) {
    this._wallet = wallet
    this._network = network
    const web3 = engine && new Web3(engine)
    try {
      this._address = engine && web3.eth.accounts[0]
    } catch (e) {
      // FIXME: what is that? Was merged as is long time ago.
      // dispatch(addError(e.message))
    }
    this._engine = engine || Web3Utils.createEngine(wallet, url, deriveNumber)
  }

  getNetwork () {
    return this._network
  }

  getAddress () {
    return this._address || this._wallet.getAddressString()
  }

  getProvider () {
    return this._engine
  }

  getPrivateKeyBufer (address) {
    const wallet = this.getWallet(address)
    return wallet.getPrivateKey()
  }

  getPrivateKey (address) {
    const wallet = this.getWallet(address)
    return wallet && wallet.getPublicKey && Buffer.from(wallet.getPublicKey()).toString('hex')
  }

  getPublicKey () {
    return this._wallet && this._wallet.getPublicKey && Buffer.from(this._wallet.getPublicKey()).toString('hex')
  }

  getWallet (address) {
    if (address) {
      let resultWallet = null
      this._engine
        // eslint-disable-next-line no-underscore-dangle
        ? this._engine.wallets.some((wallet) => {
          if (wallet.getAddressString() === address) {
            resultWallet = wallet
            return true
          }
        })
        : null
      return resultWallet
    }
    return this._wallet
  }

  createNewChildAddress (deriveNumber = 0) {
    const hdWallet = hdKey.fromMasterSeed(this._wallet.getPrivateKey())
    return hdWallet.derivePath(`${WALLET_HD_PATH}/${deriveNumber}`).getWallet()
  }

  signTx (tx: Tx, signerAddress) {
    switch (this._wallet.type) {
      case  'memory':
        tx.sign(this.getPrivateKeyBufer(signerAddress))

        const wallet = this.getWallet(signerAddress)
        return {
          walletType: wallet ? wallet.type : null,
          signedTx: tx,
        }
    }
  }
}
