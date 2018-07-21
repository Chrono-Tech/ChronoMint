module.exports = class SignerModel {
  getAddress () {
    throw new Error('Not implemented')
  }

  async signTransaction (tx) { // tx object
    throw new Error('Not implemented')
  }

  async signData (data) { // data object
    throw new Error('Not implemented')
  }

  async encrypt (password) { // password argument is required only for the in-memory wallet
    throw new Error('Not implemented')
  }
}
