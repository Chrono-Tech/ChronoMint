import MultisigWalletDAO from 'dao/MultisigWalletDAO'
import EventEmitter from 'events'
import type MultisigTransactionModel from 'models/wallet/MultisigTransactionModel'
import type MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'

export const EVENT_CONFIRMATION = 'Confirmation'
export const EVENT_REVOKE = 'Revoke'
export const EVENT_DEPOSIT = 'Deposit'
export const EVENT_CONFIRMATION_NEEDED = 'ConfirmationNeeded'
export const EVENT_SINGLE_TRANSACTION = 'SingleTransact'
export const EVENT_MULTI_TRANSACTION = 'MultiTransact'
export const EVENT_OWNER_REMOVED = 'OwnerRemoved'
export const EVENT_OWNER_ADDED = 'OwnerAdded'
export const EVENT_REMOVE = 'WalletRemove'

class MultisigWalletService extends EventEmitter {

  constructor () {
    super(...arguments)
    this._cache = {}
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

  subscribeToWalletDAO (wallet: MultisigWalletModel): Promise {
    const address = wallet.address()
    const dao = this.getWalletDAO(address)

    if (!dao) {
      // eslint-disable-next-line
      throw new Error('wallet not found with address:', address)
    }

    return Promise.all([
      dao.watchOwnerAdded(wallet, (ownerAddress) => {
        this.emit(EVENT_OWNER_ADDED, address, ownerAddress)
      }),
      dao.watchOwnerRemoved(wallet, (ownerAddress) => {
        this.emit(EVENT_OWNER_REMOVED, address, ownerAddress)
      }),
      dao.watchMultiTransact(wallet, (multisigTransactionModel: MultisigTransactionModel) => {
        this.emit(EVENT_MULTI_TRANSACTION, address, multisigTransactionModel)
      }),
      dao.watchSingleTransact(wallet, (result) => {
        this.emit(EVENT_SINGLE_TRANSACTION, result)
      }),
      dao.watchConfirmationNeeded(wallet, (pendingTxModel) => {
        this.emit(EVENT_CONFIRMATION_NEEDED, address, pendingTxModel)
      }),
      dao.watchDeposit(wallet, (value) => {
        this.emit(EVENT_DEPOSIT, address, 'ETH', value)
      }),
      dao.watchRevoke(wallet, (id) => {
        this.emit(EVENT_REVOKE, address, id)
      }),
      dao.watchConfirmation(wallet, (id, owner) => {
        this.emit(EVENT_CONFIRMATION, address, id, owner)
      }),
      // dao.watchRemove(wallet, (result) => {
      //   this.emit(EVENT_REMOVE, address, result)
      // }),
      dao.watchError(wallet, (errorCode) => {
        if (errorCode === resultCodes.WALLET_CONFIRMATION_NEEDED) {
          this.emit(EVENT_CONFIRMATION_NEEDED, address, new MultisigWalletPendingTxModel({
            // TODO @dkchv: no id (operation here) :(
          }))
        }
        console.log('--MultisigWalletService#', errorCode)
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
