import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import EventEmitter from 'events'

export const walletsManagerFunctions = {
  GET_WALLETS: 'getWallets',
  CREATE_WALLET: 'createWallet'
}

export const walletsManagerEvents = {
  WALLET_CREATED: 'WalletCreated'
}

export const eventParams = {}
eventParams[walletsManagerEvents.WALLET_CREATED] = {
  SELF: 'self',
  WALLET: 'wallet'
}

export default class WalletsManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/WalletsManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
    this._watchEvents()
  }

  async getWallets () {
    const wallets = await this._call(walletsManagerFunctions.GET_WALLETS)
    console.log('getWallets, wallets =', wallets)
    return wallets
  }

  //async createWalletNoEmit (walletOwners, requiredSignaturesNum, walletName) {
  //  const created = await this._tx(
  //    walletsManagerFunctions.CREATE_WALLET, [
  //      walletOwners,
  //      requiredSignaturesNum,
  //      this._c.stringToBytes(walletName)
  //    ], {
  //      walletOwners,
  //      requiredSignaturesNum,
  //      walletName: walletName
  //    }
  //  )
  //  console.log('createWallet, tx created =', created)
  //  return created
  //}

  //createWalletResultToObject (result) {
  //  return {
  //    selfAddress: result.args[eventParams[walletsManagerEvents.WALLET_CREATED].SELF],
  //    walletAddress: result.args[eventParams[walletsManagerEvents.WALLET_CREATED].WALLET]
  //  }
  //}

  //emitter = new EventEmitter()
  _emitter = new EventEmitter()

  //async watchCreateWallet (callback) {
  //  return this._watch(walletsManagerEvents.WALLET_CREATED, async (result) => {
  //    console.log('WalletsManagerEvents.WALLET_CREATED, watchCreateWallet result =', result)
  //    const created = this.createWalletResultToObject(result)
  //    callback(
  //      result,
  //      created.selfAddress,
  //      created.walletAddress
  //    )
  //  })
  //}

  async _watchEvents () {
    return this._watch(walletsManagerEvents.WALLET_CREATED, async (result) => {
      console.log('WalletsManagerEvents.WALLET_CREATED, watch result =', result)
      this._emitter.emit(walletsManagerEvents.WALLET_CREATED, result)
    })
  }

  createWallet = async (walletOwners, requiredSignaturesNum, walletName) => {
    const created = await this._tx(
      walletsManagerFunctions.CREATE_WALLET, [
        walletOwners,
        requiredSignaturesNum,
        this._c.stringToBytes(walletName)
      ], {
        walletOwners,
        requiredSignaturesNum,
        walletName
      }
    )
    console.log('createWalletEmit, tx created =', created)
    return new Promise((resolve, reject) => {
      const handler = result => {
        console.log('an _event occurred! _event =', walletsManagerEvents.WALLET_CREATED, 'result =', result)
        if (result.transactionHash === created.tx) {
          console.log('result.transactionHash === created.tx =', created.tx)
          this._emitter.removeListener(walletsManagerEvents.WALLET_CREATED, handler)
          //resolve(this.createWalletResultToObject(result))
          resolve({
            selfAddress: result.args[eventParams[walletsManagerEvents.WALLET_CREATED].SELF],
            walletAddress: result.args[eventParams[walletsManagerEvents.WALLET_CREATED].WALLET]
          })
        }
      }
      this._emitter.on(walletsManagerEvents.WALLET_CREATED, handler)
    })
  }
}
