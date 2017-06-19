import keythereum from 'keythereum'

const params = { keyBytes: 32, ivBytes: 16 }
// Note: if options is unspecified, the values in keythereum.constants are used.
const options = {
  kdf: "pbkdf2",
  cipher: "aes-128-ctr",
  kdfparams: {
    c: 262144,
    dklen: 32,
    prf: "hmac-sha256"
  }
}

const walletGenerator = (password) => {
  return new Promise(resolve => {
    // we can't use promisify here, cause first returning argument is result not error
    keythereum.create(params, (dk) => {
      keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, (dump) => {
        resolve(dump)
      })
    })
  }).catch(e => {
    console.error('Wallet generate error', e)
  })
}

export default walletGenerator