/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import Eos from 'eosjs'
import ecc from 'eosjs-ecc'
import ethUtils from 'ethereumjs-util'
import { eddsa as EdDSA } from 'elliptic'

export default class EosMemoryDevice extends EventEmitter {
  constructor ({ privateKey }) {
    super()
    this.keys = this.createEosKeys(privateKey)
    Object.freeze(this)
  }

  createEosKeys (ethereumPrivateKey) {
    const ethPkBuf = Buffer.from(ethereumPrivateKey, 'hex')
    if (ethUtils.isValidPrivate(ethPkBuf)) {
      // Create EOS owner keys
      const convertedEOSOwnerPrivateKey = ecc.PrivateKey(ethPkBuf).toWif()
      const convertedEOSOwnerPublicKey = ecc.privateToPublic(convertedEOSOwnerPrivateKey)

      const ec = new EdDSA('ed25519') // ed25519 - preset from library
      // Create key pair for active key
      const keyPair = ec.keyFromSecret(ethPkBuf) // hex string, array or Buffer
      // Create EOS active keys
      const convertedEOSActivePrivateKey = ecc.PrivateKey(Buffer.from(keyPair.priv().toString('hex'), 'hex')).toWif()
      const convertedEOSActivePublicKey = ecc.privateToPublic(convertedEOSActivePrivateKey)

      return {
        owner: {
          priv: convertedEOSOwnerPrivateKey,
          pub: convertedEOSOwnerPublicKey,
        },
        active: {
          priv: convertedEOSActivePrivateKey,
          pub: convertedEOSActivePublicKey,
        },
      }
    } else {
      // eslint-disable-next-line
      console.log('Invalid Ethereum Private Key')
    }
  }

  signTransaction ({ chainId, transactionHeaders, tx }): Promise {
    const eos = Eos({
      httpEndpoint: null,
      chainId,
      keyProvider: this.keys.active.priv,
      transactionHeaders,
    })

    return eos.transfer(tx.from, tx.to, tx.quantity, tx.memo, false) // `false` is a shortcut for {broadcast: false}
  }
}
