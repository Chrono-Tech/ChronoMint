/** @module utils/KeyPair */
import CryptoJS from 'crypto-js'
import nacl from './nacl-fast'
import convert from './convert'

/***
* Create a BinaryKey object
*
* @param {Uint8Array} keyData - A key data
*/
let BinaryKey = function (keyData) {
  this.data = keyData
  this.toString = function () {
    return convert.ua2hex(this.data)
  }
}

let hashfunc = function (dest, data, dataLength) {
  let convertedData = convert.ua2words(data, dataLength)
  let hash = CryptoJS.SHA3(convertedData, {
    outputLength: 512,
  })
  convert.words2ua(dest, hash)
}

/***
* Create an hasher object
*/
let hashobj = function () {
  this.sha3 = CryptoJS.algo.SHA3.create({
    outputLength: 512,
  })
  this.reset = function () {
    this.sha3 = CryptoJS.algo.SHA3.create({
      outputLength: 512,
    })
  }

  this.update = function (data) {
    if (data instanceof BinaryKey) {
      let converted = convert.ua2words(data.data, data.data.length)
      // let result = CryptoJS.enc.Hex.stringify(converted)
      this.sha3.update(converted)
    } else if (data instanceof Uint8Array) {
      let converted = convert.ua2words(data, data.length)
      this.sha3.update(converted)
    } else if (typeof data === "string") {
      let converted = CryptoJS.enc.Hex.parse(data)
      this.sha3.update(converted)
    } else {
      throw new Error("unhandled argument")
    }
  }

  this.finalize = function (result) {
    let hash = this.sha3.finalize()
    convert.words2ua(result, hash)
  }
}

/***
* Create a KeyPair Object
*
* @param {string} privkey - An hex private key
*/
let KeyPair = function (privkey) {
  this.publicKey = new BinaryKey(new Uint8Array(nacl.lowlevel.crypto_sign_PUBLICKEYBYTES))
  this.secretKey = convert.hex2ua_reversed(privkey)
  nacl.lowlevel.crypto_sign_keypair_hash(this.publicKey.data, this.secretKey, hashfunc)

  // Signature
  this.sign = (data) => {
    let sig = new Uint8Array(64)
    let hasher = new hashobj()
    let r = nacl.lowlevel.crypto_sign_hash(sig, this, data, hasher)
    if (!r) {
      alert("Couldn't sign the tx, generated invalid signature")
      throw new Error("Couldn't sign the tx, generated invalid signature")
    }
    return new BinaryKey(sig)
  }
}

const create = function (hexdata) {
  let r = new KeyPair(hexdata)
  return r
}

export default {
  create,
}
