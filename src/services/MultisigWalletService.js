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

  subscribeToWalletDAO (address) {
    const dao = this.getWalletDAO(address)
    return Promise.all([
      dao.watchOwnerRemoved((result) => {
        this.emit('OwnerRemoved', result)
      }),
      dao.watchMultiTransact((result) => {
        this.emit('MultiTransact', result)
      }),
      dao.watchSingleTransact((result) => {
        this.emit('SingleTransact', result)
      }),
      dao.watchConfirmationNeeded(pendingTxModel => {
        this.emit('ConfirmationNeeded', address, pendingTxModel)
      }),
      dao.watchDeposit(value => {
        this.emit('Deposit', address, 'ETH', value)
      })
    ])
  }
}

export default new MultisigWalletService()
