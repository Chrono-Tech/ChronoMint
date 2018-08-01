/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { BLOCKCHAIN_ETHEREUM } from './EthereumDAO'
import type MultisigWalletDAO from './MultisigWalletDAO'
import AddressesCollection from '../models/wallet/AddressesCollection'
import AddressModel from '../models/wallet/AddressModel'
import MultisigEthWalletModel from '../models/wallet/MultisigEthWalletModel'
import multisigWalletService from '../services/MultisigWalletService'
import AbstractContractDAO from './AbstractContract3DAO'
import { EE_MS_WALLET_ADDED, EE_MS_WALLET_REMOVED, EE_MS_WALLETS_COUNT } from './constants'

export default class WalletsManagerDAO extends AbstractContractDAO {

  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  isInited () {
    return this._isInit
  }

  async init () {
    // await Promise.all([
    //   this.watchWalletCreate(),
    //   this.watchWalletRemoved(),
    // ])
    // this._isInit = true
  }

  // ---------- watchers ---------

  watchWalletCreate () {
    return this._watch(
      'WalletCreated',
      async (result) => {
        const walletDAO: MultisigWalletDAO = await multisigWalletService.createWalletDAO(result.args.wallet)
        const is2FA = await walletDAO.use2FA()
        return this._createWalletModel(result.args.wallet, is2FA, result.transactionHash)
      },
      { by: this.getAccount() },
    )
  }

  watchWalletRemoved () {
    return this._watch(
      'WalletDeleted',
      (result) => this.emit(EE_MS_WALLET_REMOVED, result.args.wallet),
    )
  }

  // --------- actions ----------

  async fetchWallets () {
    const res = await this.contract.methods.getWallets().call()
    const [addresses, is2FA] = Object.values(res)
    const validAddresses = addresses.filter((address) => !this.isEmptyAddress(address))
    this.emit(EE_MS_WALLETS_COUNT, validAddresses.length)

    validAddresses.forEach((address, i) => {
      this._createWalletModel(address, is2FA[i])
    })
  }

  async _createWalletModel (address, is2FA, transactionHash) {
    const walletDAO: MultisigWalletDAO = await multisigWalletService.createWalletDAO(address, this.web3)
    const [owners, requiredSignatures, pendingTxList, releaseTime] = await Promise.all([
      walletDAO.getOwners(),
      walletDAO.getRequired(),
      walletDAO.getPendings(),
      walletDAO.getReleaseTime(),
    ])

    let addresses = new AddressesCollection()
    addresses = addresses.add(new AddressModel({
      id: BLOCKCHAIN_ETHEREUM,
      address,
    }))

    const wallet = new MultisigEthWalletModel({
      address,
      owners: owners.map((owner) => owner.toLowerCase()),
      transactionHash,
      requiredSignatures: requiredSignatures.toString(),
      is2FA,
      isFetched: true,
      pendingTxList,
      addresses,
      releaseTime: releaseTime > 0 ? new Date(releaseTime * 1000) : null,
      blockchain: BLOCKCHAIN_ETHEREUM,
      isMultisig: true,
      isTimeLocked: releaseTime > 0,
    })
    this.emit(EE_MS_WALLET_ADDED, wallet)
  }

  createWallet (wallet: MultisigEthWalletModel) {
    const owners = wallet.owners().items().map((item) => item.address())
    this._tx(
      'createWallet',
      [
        owners,
        wallet.requiredSignatures(),
        Math.floor(wallet.releaseTime() / 1000),
      ],
      new BigNumber(0),
      new BigNumber(0),
      {
        fields: wallet.toCreateWalletTx(),
        id: wallet.id(),
      },
    )
  }

  async create2FAWallet (wallet: MultisigEthWalletModel, feeMultiplier) {
    const result = await this._tx(
      'create2FAWallet',
      [Math.floor(wallet.releaseTime() / 1000)],
      wallet.toCreateWalletTx(),
      null,
      { feeMultiplier },
    )
    return result.tx
  }

  getOraclePrice () {
    return this._call('getOraclePrice')
  }
}
