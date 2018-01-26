export default class HardwareWallet {
  constructor (address) {
    this._address = address
  }

  getAddressString () {
    return this._address
  }
}
