/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import dashcore from 'dashcore-lib'

export default class DashMemoryDevice extends EventEmitter {
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
        s: dashcore.util.EMPTY_BUFFER,
        q: unsignedTx.ins[i].q,
        o: unsignedTx.ins[i].o,
      })
    }
    txobj.outs = unsignedTx.outs
    return new dashcore.Transaction(txobj)
  }

  signTransaction (unsignedHex, path) {
    // function used to each for each type
    const fnToSign = {}
    /* eslint-disable no-underscore-dangle */
    fnToSign[dashcore.Script.TX_PUBKEYHASH] = dashcore.TransactionBuilder.prototype._signPubKeyHash
    fnToSign[dashcore.Script.TX_PUBKEY] = dashcore.TransactionBuilder.prototype._signPubKey
    fnToSign[dashcore.Script.TX_MULTISIG] = dashcore.TransactionBuilder.prototype._signMultiSig
    fnToSign[dashcore.Script.TX_SCRIPTHASH] = dashcore.TransactionBuilder.prototype._signScriptHash
    /* eslint-enable no-underscore-dangle */

    // build key map
    const address = this.getAddress(path)
    const wkMap = {}
    wkMap[address] = new dashcore.WalletKey({ network: this.network, privKey: this.privateKey(path) })

    // unserialize raw transaction
    const raw = new dashcore.buffertools.Buffer(unsignedHex, 'hex')
    const unsignedTx = new dashcore.Transaction()
    unsignedTx.parse(raw)

    // prepare  signed transaction
    const signedTx = new dashcore.TransactionBuilder()
    signedTx.tx = this._prepareSignedTransaction(unsignedTx)

    for (let i = 0; i < unsignedTx.ins.length; i++) {
      // init parameters
      const txin = unsignedTx.ins[i]
      const scriptPubKey = new dashcore.Script(txin.s)
      const input = {
        address: address,
        scriptPubKey: scriptPubKey,
        scriptType: scriptPubKey.classify(),
        i: i,
      }

      // generating hash for signature
      const txSigHash = unsignedTx.hashForSignature(scriptPubKey, i, dashcore.Transaction.SIGHASH_ALL)

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
      const HDPrivateKey = dashcore.HDPrivateKey

      const hdPrivateKey = new HDPrivateKey()
      // const retrieved = new HDPrivateKey(this.seed)
      const derived = hdPrivateKey.derive(derivedPath)
      return derived
    }
    const PrivateKey = dashcore.PrivateKey
    const imported = PrivateKey.fromWIF(this.seed)

    return imported
  }
}
