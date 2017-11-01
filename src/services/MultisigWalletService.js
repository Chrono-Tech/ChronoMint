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

  subscribeToWalletDAO (wallet) {
    const dao = this.getWalletDAO(wallet.address())

    return Promise.all([
      dao.watchOwnerRemoved(wallet, (result) => {
        this.emit('OwnerRemoved', result)
      }),
      dao.watchMultiTransact(wallet, (result) => {
        this.emit('MultiTransact', result)
      }),
      dao.watchSingleTransact(wallet, (result) => {
        this.emit('SingleTransact', result)
      }),
      dao.watchConfirmationNeeded(wallet, (pendingTxModel) => {
        this.emit('ConfirmationNeeded', wallet.address(), pendingTxModel)
      }),
      dao.watchDeposit(wallet, (value) => {
        this.emit('Deposit', wallet.address(), 'ETH', value)
      }),
      dao.watchRevoke(wallet, (id) => {
        this.emit('Revoke', wallet.address(), id)
      }),
      dao.watchConfirmation(wallet, (id, owner) => {
        this.emit('Confirmation', wallet.address(), id, owner)
      }),
    ])
  }
}

export default new MultisigWalletService()
