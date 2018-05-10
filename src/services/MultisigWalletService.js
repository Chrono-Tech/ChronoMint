/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import OwnerModel from 'models/wallet/OwnerModel'
import MultisigWalletDAO from 'dao/MultisigWalletDAO'
import EventEmitter from 'events'
import type MultisigTransactionModel from 'models/wallet/MultisigTransactionModel'
import type MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'

export const EE_CONFIRMATION = 'Confirmation'
export const EE_REVOKE = 'Revoke'
export const EE_DEPOSIT = 'Deposit'
export const EE_CONFIRMATION_NEEDED = 'ConfirmationNeeded'
export const EE_SINGLE_TRANSACTION = 'SingleTransact'
export const EE_MULTI_TRANSACTION = 'MultiTransact'
export const EE_OWNER_REMOVED = 'OwnerRemoved'
export const EE_OWNER_ADDED = 'OwnerAdded'
export const EE_REQUIREMENT_CHANGED = 'RequirementChanged'

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
      dao.watchOwnerAdded(wallet, (owner: OwnerModel) => {
        this.emit(EE_OWNER_ADDED, address, owner)
      }),
      dao.watchOwnerRemoved(wallet, (owner: OwnerModel) => {
        this.emit(EE_OWNER_REMOVED, address, owner)
      }),
      dao.watchMultiTransact(wallet, (multisigTransactionModel: MultisigTransactionModel) => {
        this.emit(EE_MULTI_TRANSACTION, address, multisigTransactionModel)
      }),
      dao.watchSingleTransact(wallet, (result) => {
        this.emit(EE_SINGLE_TRANSACTION, result)
      }),
      dao.watchConfirmationNeeded(wallet, (pendingTxModel) => {
        this.emit(EE_CONFIRMATION_NEEDED, address, pendingTxModel)
      }),
      dao.watchDeposit(wallet, () => {
        this.emit(EE_DEPOSIT, address, 'ETH')
      }),
      dao.watchRevoke(wallet, (id) => {
        this.emit(EE_REVOKE, address, id)
      }),
      dao.watchConfirmation(wallet, (id, owner) => {
        this.emit(EE_CONFIRMATION, address, id, owner)
      }),
      dao.watchError(wallet, (errorCode) => {
        if (errorCode === resultCodes.WALLET_CONFIRMATION_NEEDED) {
          this.emit(EE_CONFIRMATION_NEEDED, address, new MultisigWalletPendingTxModel({
            // TODO @dkchv: no id (operation here) :(
          }))
        }
      }),
      dao.watchRequirementChanged(wallet, (required) => {
        this.emit(EE_REQUIREMENT_CHANGED, address, required)
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
