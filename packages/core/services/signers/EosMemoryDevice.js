/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import Eos from 'eosjs'
import ecc from 'eosjs-ecc'
import ethUtils from 'ethereumjs-util'

export default class EosMemoryDevice extends EventEmitter {
  constructor ({ privateKey }) {
    super()
    this.keys = this.createEosKeys(privateKey)
    Object.freeze(this)
  }

  createEosKeys (ethereumPrivateKey) {
    if (ethUtils.isValidPrivate(Buffer.from(ethereumPrivateKey, 'hex'))) {
      // Create EOS owner keys
      const convertedEOSOwnerPrivateKey = ecc.PrivateKey(Buffer.from(ethereumPrivateKey, 'hex')).toWif()
      const convertedEOSOwnerPublicKey = ecc.privateToPublic(convertedEOSOwnerPrivateKey)

      // Create EOS active keys
      const convertedEOSActivePrivateKey = ecc.PrivateKey(Buffer.from(ethereumPrivateKey, 'hex').reverse()).toWif() // TODO implement something more smart
      const convertedEOSActivePublicKey = ecc.privateToPublic(convertedEOSActivePrivateKey)

      // eslint-disable-next-line
      console.log(`eth pk: ${ethereumPrivateKey}`)
      // eslint-disable-next-line
      console.log(`EOS Private owner Key: ${convertedEOSOwnerPrivateKey}`)
      // eslint-disable-next-line
      console.log(`EOS Public owner Key: ${convertedEOSOwnerPublicKey}`)

      // eslint-disable-next-line
      console.log(`EOS Private active Key: ${convertedEOSActivePrivateKey}`)
      // eslint-disable-next-line
      console.log(`EOS Public active Key: ${convertedEOSActivePublicKey}`)

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
      console.log("Invalid Ethereum Private Key")
    }
  }

  signTransaction ({ chainId, transactionHeaders, tx }): Promise {
    const eos = Eos({
      httpEndpoint: null,
      chainId,
      keyProvider: this.keys.active.priv,
      transactionHeaders,
    })

    return eos.transfer(tx.from, tx.to, tx.amount, tx.memo, false) // `false` is a shortcut for {broadcast: false}
  }
}
