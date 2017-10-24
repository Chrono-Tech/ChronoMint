import EventEmitter from 'events'
import MultisigWalletDAO from 'dao/MultisigWalletDAO'

class MultisigWalletService extends EventEmitter {

  constructor () {
    super(...arguments)
    this._cache = {}
  }

  init () {

  }

  getWalletDAO (address) {
    if (!this._cache[address]) {
      this._cache[address] = new MultisigWalletDAO(address)
    }
    return this._cache[address]
  }

  async subscribeToWalletDAO (address) {
    const dao = this.getWalletDAO(address)
    await dao.watchConfirmationNeeded(pendingTxModel => {
      this.emit('ConfirmationNeeded', address, pendingTxModel)
    })
    await dao.watchDeposit(result => {
      this.emit('Deposit', address, 'ETH', result.args.value)
    })
  }
}

export default new MultisigWalletService()
