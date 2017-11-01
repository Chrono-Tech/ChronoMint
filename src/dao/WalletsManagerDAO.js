import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import multisigWalletService from 'services/MultisigWalletService'

import AbstractContractDAO from 'dao/AbstractContractDAO'
import type MultisigWalletDAO from 'dao/MultisigWalletDAO'

import MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import WalletNoticeModel, { statuses } from 'models/notices/WalletNoticeModel'

const functions = {
  GET_WALLETS: 'getWallets',
  CREATE_WALLET: 'createWallet',
}

const events = {
  ERROR: 'Error',
  WALLET_ADDED: 'WalletAdded',
  WALLET_CREATED: 'WalletCreated',
}

const eventParams = {}
eventParams[events.ERROR] = {
  SELF: 'self',
  ERROR_CODE: 'errorCode',
}
eventParams[events.WALLET_ADDED] = {
  SELF: 'self',
  WALLET: 'wallet',
}
eventParams[events.WALLET_CREATED] = {
  SELF: 'self',
  WALLET: 'wallet',
}

export default class WalletsManagerDAO extends AbstractContractDAO {

  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/WalletsManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json'),
    )
  }

  // ---------- watchers ---------

  async watchWalletCreate (callback) {
    return this._watch(events.WALLET_CREATED, async (result) => {
      const wallet = await this._createWalletModel(result.args.wallet, false, result.transactionHash)
      callback(wallet, new WalletNoticeModel({
        name: wallet.name(),
        action: statuses.CREATED,
      }))
    })
  }

  // --------- actions ----------

  async getWallets () {
    const [addresses, is2FA] = await this._call(functions.GET_WALLETS)
    let models = new Immutable.Map()
    let promises = []
    addresses.forEach((address, i) => {
      promises.push(this._createWalletModel(address, is2FA[i]))
    })
    const wallets = await Promise.all(promises)
    for (let wallet of wallets) {
      models = models.set(wallet.address(), wallet)
    }
    return models
  }

  async _createWalletModel (address, is2FA, transactionHash) {
    const walletDAO: MultisigWalletDAO = multisigWalletService.getWalletDAO(address)
    const [owners, requiredSignatures, tokens] = await Promise.all([
      await walletDAO.getOwners(),
      await walletDAO.getRequired(),
      await walletDAO.getTokens(),
    ])

    const pendingTxList = await walletDAO.getPendings(tokens)

    return new MultisigWalletModel({
      owners: new Immutable.List(owners),
      address,
      transactionHash,
      requiredSignatures,
      dao: walletDAO,
      tokens,
      is2FA,
      isFetched: true,
      pendingTxList,
    })
  }

  async createWallet (wallet: MultisigWalletModel) {
    const result = await this._tx(functions.CREATE_WALLET, [
      wallet.owners(),
      wallet.requiredSignatures(),
      new BigNumber(0),
    ], wallet)
    return result.tx
  }

  async removeWallet (wallet) {
    const result = await this._tx('removeWallet', [], {
      address: wallet.address(),
    })
    return result.tx
  }
}
