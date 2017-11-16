import EventEmitter from 'events'
import MultisigWalletDAO from 'dao/MultisigWalletDAO'
import type MultisigTransactionModel from 'models/Wallet/MultisigTransactionModel'

const EVENT_CONFIRMATION = 'Confirmation'
const EVENT_REVOKE = 'Revoke'
const EVENT_DEPOSIT = 'Deposit'
const EVENT_CONFIRMATION_NEEDED = 'ConfirmationNeeded'
const EVENT_SINGLE_TRANSACTION = 'SingleTransact'
const EVENT_MULTI_TRANSACTION = 'MultiTransact'
const EVENT_OWNER_REMOVED = 'OwnerRemoved'

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
        this.emit(EVENT_OWNER_REMOVED, result)
      }),
      dao.watchMultiTransact(wallet, (multisigTransactionModel: MultisigTransactionModel) => {
        this.emit(EVENT_MULTI_TRANSACTION, wallet.address(), multisigTransactionModel)
      }),
      dao.watchSingleTransact(wallet, (result) => {
        this.emit(EVENT_SINGLE_TRANSACTION, result)
      }),
      dao.watchConfirmationNeeded(wallet, (pendingTxModel) => {
        this.emit(EVENT_CONFIRMATION_NEEDED, wallet.address(), pendingTxModel)
      }),
      dao.watchDeposit(wallet, (value) => {
        this.emit(EVENT_DEPOSIT, wallet.address(), 'ETH', value)
      }),
      dao.watchRevoke(wallet, (id) => {
        this.emit(EVENT_REVOKE, wallet.address(), id)
      }),
      dao.watchConfirmation(wallet, (id, owner) => {
        this.emit(EVENT_CONFIRMATION, wallet.address(), id, owner)
      }),
    ])
  }

  unsubscribeAll () {
    const promises = []
    for (let walletDAO in this._cache) {
      promises.push(walletDAO.stopWatching())
    }
    return Promise.all(promises)
  }
}

export default new MultisigWalletService()
