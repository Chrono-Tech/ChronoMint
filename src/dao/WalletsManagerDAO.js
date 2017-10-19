import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import EventEmitter from 'events'

const functions = {
  GET_WALLETS: 'getWallets',
  CREATE_WALLET: 'createWallet'
}

const events = {
  ERROR: 'Error',
  WALLET_ADDED: 'WalletAdded',
  WALLET_CREATED: 'WalletCreated',
}

const eventParams = {}
eventParams[events.ERROR] = {
  SELF: 'self',
  ERROR_CODE: 'errorCode'
}
eventParams[events.WALLET_ADDED] = {
  SELF: 'self',
  WALLET: 'wallet'
}
eventParams[events.WALLET_CREATED] = {
  SELF: 'self',
  WALLET: 'wallet'
}

export default class WalletsManagerDAO extends AbstractMultisigContractDAO {
  static functions = functions
  static events = events
  static eventParams = eventParams

  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/WalletsManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
    this._watchEvents()
  }

  async getWallets () {
    const wallets = await this._call(functions.GET_WALLETS)
    return wallets
  }

  _pending = {}
  _emitter = new EventEmitter()
  emitter = new EventEmitter()

  async _watchEvents () {
    this._watch(events.ERROR, async (result) => {
      // internal event (comes from this user)
      if (this._pending[result.transactionHash]) return this._emitter.emit(events.ERROR, result)
      // external event (comes from other users)
      this.emitter.emit(events.ERROR, this.errorResultToObj(result))
    })
    this._watch(events.WALLET_CREATED, async (result) => {
      // internal event (comes from this user)
      if (this._pending[result.transactionHash]) return this._emitter.emit(events.WALLET_CREATED, result)
      // external event (comes from other users)
      this.emitter.emit(events.WALLET_CREATED, this.walletCreatedResultToObj(result))
    })
  }

  errorResultToObj = (result) => ({
    selfAddress: result.args[eventParams[events.WALLET_CREATED].SELF],
    errorCode: result.args[eventParams[events.WALLET_CREATED].ERROR_CODE]
  })

  walletCreatedResultToObj = (result) => ({
    selfAddress: result.args[eventParams[events.WALLET_CREATED].SELF],
    walletAddress: result.args[eventParams[events.WALLET_CREATED].WALLET]
  })

  createWallet = async (walletOwners, requiredSignaturesNum, walletName) => {
    let created = null
    try {
      created = await this._tx(
        functions.CREATE_WALLET, [
          walletOwners,
          requiredSignaturesNum,
          this._c.stringToBytes(walletName)
        ], {
          walletOwners,
          requiredSignaturesNum,
          walletName
        }
      )
    } catch (error) {
      return Promise.reject(error)
    }
    this._pending[created.tx] = created
    return new Promise((resolve, reject) => {
      const successHandler = result => {
        if (result.transactionHash === created.tx) {
          delete this._pending[created.tx]
          this._emitter.removeListener(events.WALLET_CREATED, successHandler)
          this._emitter.removeListener(events.ERROR, errorHandler)
          resolve(this.walletCreatedResultToObj(result))
        }
      }
      const errorHandler = result => {
        if (result.transactionHash === created.tx) {
          delete this._pending[created.tx]
          this._emitter.removeListener(events.WALLET_CREATED, successHandler)
          this._emitter.removeListener(events.ERROR, errorHandler)
          reject(this.errorResultToObj(result))
        }
      }
      this._emitter.on(events.WALLET_CREATED, successHandler)
      this._emitter.on(events.ERROR, errorHandler)
    })
  }
}
