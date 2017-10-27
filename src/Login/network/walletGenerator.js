import keythereum from 'keythereum'

// Note: if options is unspecified, the values in keythereum.constants are used.

class WalletGenerator {
  constructor () {
    this._options = {
      kdf: "pbkdf2",
      cipher: "aes-128-ctr",
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: "hmac-sha256",
      },
    }

    this._params = {
      keyBytes: 32,
      ivBytes: 16,
    }
  }

  getWallet = password => {
    return new Promise(resolve => {
      // we can't use promisify here, cause first returning argument is result not error
      keythereum.create(this._params, dk => {
        keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, this._options, dump => {
          resolve(dump)
        })
      })
    }).catch(e => {
      // TODO @bshevchenko: fallback strategy
      // eslint-disable-next-line
      console.error('Wallet generate error', e)
    })
  }
}


export default new WalletGenerator()

