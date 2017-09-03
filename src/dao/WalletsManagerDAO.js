import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

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
  }

  async getWallets () {
    const wallets = await this._call(walletsManagerFunctions.GET_WALLETS)
    console.log('getWallets, wallets =', wallets)
    return wallets
  }

  async createWallet (walletOwners, requiredSignaturesNum, walletName) {
    const created = await this._tx(
      walletsManagerFunctions.CREATE_WALLET, [
        walletOwners,
        requiredSignaturesNum,
        this._c.stringToBytes(walletName)
      ], {
        walletOwners,
        requiredSignaturesNum,
        walletName: walletName
      }
    )
    console.log('createWallet, tx created =', created)
    return created
  }

  async watchCreateWallet (callback) {
    return this._watch(walletsManagerEvents.WALLET_CREATED, async (result) => {
      console.log('WalletsManagerEvents.WALLET_CREATED, result =', result)
      callback(
        result.args[eventParams[walletsManagerEvents.WALLET_CREATED].SELF],
        result.args[eventParams[walletsManagerEvents.WALLET_CREATED].WALLET]
      )
    })
  }
}
