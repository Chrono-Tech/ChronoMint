/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import bitcore from 'bitcore-lib'

export default class BitcoinMemoryDevice extends EventEmitter {
  constructor ({ seed, network }) {
    super()
    this.seed = seed
    this.network = network
    Object.freeze(this)
  }

  privateKey (path) {
    return this._getDerivedWallet(path).privateKey
  }

  // this method is a part of base interface
  getAddress (path) {
    return this._getDerivedWallet(path).privateKey.toAddress(this.network)
  }

  _prepareSignedTransaction (unsignedTx) {
    const txobj = {}
    txobj.version = unsignedTx.version
    txobj.lock_time = unsignedTx.lock_time
    txobj.ins = []
    for (let i = 0; i < unsignedTx.ins.length; i++) {
      txobj.ins.push({
        s: bitcore.util.EMPTY_BUFFER,
        q: unsignedTx.ins[i].q,
        o: unsignedTx.ins[i].o,
      })
    }
    txobj.outs = unsignedTx.outs
    return new bitcore.Transaction(txobj)
  }

  signTransaction (unsignedHex, path) {
    // function used to each for each type
    const fnToSign = {}
    /* eslint-disable no-underscore-dangle */
    fnToSign[bitcore.Script.TX_PUBKEYHASH] = bitcore.TransactionBuilder.prototype._signPubKeyHash
    fnToSign[bitcore.Script.TX_PUBKEY] = bitcore.TransactionBuilder.prototype._signPubKey
    fnToSign[bitcore.Script.TX_MULTISIG] = bitcore.TransactionBuilder.prototype._signMultiSig
    fnToSign[bitcore.Script.TX_SCRIPTHASH] = bitcore.TransactionBuilder.prototype._signScriptHash
    /* eslint-enable no-underscore-dangle */

    // build key map
    const address = this.getAddress(path)
    const wkMap = {}
    wkMap[address] = new bitcore.WalletKey({ network: this.network, privKey: this.privateKey(path) })

    // unserialize raw transaction
    const raw = new bitcore.buffertools.Buffer(unsignedHex, 'hex')
    const unsignedTx = new bitcore.Transaction()
    unsignedTx.parse(raw)

    // prepare  signed transaction
    const signedTx = new bitcore.TransactionBuilder()
    signedTx.tx = this._prepareSignedTransaction(unsignedTx)

    for (let i = 0; i < unsignedTx.ins.length; i++) {
      // init parameters
      const txin = unsignedTx.ins[i]
      const scriptPubKey = new bitcore.Script(txin.s)
      const input = {
        address: address,
        scriptPubKey: scriptPubKey,
        scriptType: scriptPubKey.classify(),
        i: i,
      }

      // generating hash for signature
      const txSigHash = unsignedTx.hashForSignature(scriptPubKey, i, bitcore.Transaction.SIGHASH_ALL)

      // sign hash
      const ret = fnToSign[input.scriptType].call(signedTx, wkMap, input, txSigHash)

      // inject signed script in transaction object
      if (ret && ret.script) {
        signedTx.tx.ins[i].s = ret.script
        if (ret.inputFullySigned) signedTx.inputsSigned++
        if (ret.signaturesAdded) signedTx.signaturesAdded += ret.signaturesAdded
      }
    }

    return signedTx.tx.serialize().toString('hex')
  }

  _getDerivedWallet (derivedPath) {
    if (this.seed.lengh > 64) {
      const HDPrivateKey = bitcore.HDPrivateKey

      const hdPrivateKey = new HDPrivateKey()
      // const retrieved = new HDPrivateKey(this.seed)
      const derived = hdPrivateKey.derive(derivedPath)
      return derived
    }
    const PrivateKey = bitcore.PrivateKey
    const imported = PrivateKey.fromWIF(this.seed)

    return imported
  }
}
