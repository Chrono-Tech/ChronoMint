import MultisigWalletDAO from 'dao/MultisigWalletDAO'
import EventEmitter from 'events'
import type MultisigTransactionModel from 'models/Wallet/MultisigTransactionModel'
import type MultisigWalletModel from 'models/Wallet/MultisigWalletModel'

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
    return this._cache[ address ]
  }

  async createWalletDAO (address) {
    const oldDAO = this._cache[ address ]
    if (oldDAO) {
      await this.unsubscribe(address)
    }
    const newDAO = new MultisigWalletDAO(address)
    this._cache[ address ] = newDAO
    return newDAO
  }

  _handleOwnerRemoved = (result) => {
    this.emit(EVENT_OWNER_REMOVED, result)
  }

  async subscribeToWalletDAO (wallet: MultisigWalletModel) {
    const address = wallet.address()
    const dao = this.getWalletDAO(address)

    if (!dao) {
      // eslint-disable-next-line
      throw new Error('wallet not found with address:', wallet.address())
    }

    return Promise.all([
      dao.watchOwnerRemoved(wallet, this._handleOwnerRemoved),
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

  async unsubscribe (address) {
    const dao = this.getWalletDAO(address)
    if (!dao) {
      return
    }
    await dao.stopWatching()
  }

  async unsubscribeAll () {
    const promises = []
    for (let walletDAO in this._cache) {
      promises.push(walletDAO.stopWatching())
    }
    await Promise.all(promises)
    this._cache = {}
  }
}

export default new MultisigWalletService()
