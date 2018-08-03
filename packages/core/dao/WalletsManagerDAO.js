/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import type MultisigWalletDAO from './MultisigWalletDAO'
import AddressesCollection from '../models/wallet/AddressesCollection'
import AddressModel from '../models/wallet/AddressModel'
import MultisigEthWalletModel from '../models/wallet/MultisigEthWalletModel'
import multisigWalletService from '../services/MultisigWalletService'
import AbstractContractDAO from './AbstractContract3DAO'

//#region CONSTANTS

import {
  EE_MS_WALLET_ADDED,
  EE_MS_WALLET_REMOVED,
  EE_MS_WALLETS_COUNT,
} from './constants/EthereumDAO'
import {
  BLOCKCHAIN_ETHEREUM,
} from './constants'

//#endregion CONSTANTS

export default class WalletsManagerDAO extends AbstractContractDAO {

  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  isInited () {
    return this._isInit
  }

  /**
   * connect DAO to web3 and history contract
   * @param web3
   * @param options
   */
  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleAllEventsData)
  }

  /**
   * handel data events
   * @param data
   */
  handleAllEventsData = (data) => {
    switch (data.event) {
      case 'WalletCreated' :
        this.handleWalletCreate(data)
        break
      case 'WalletRemoved':
        this.handleWalletRemoved(data)
        break
    }
  }

  //#region Handlers

  /**
   * handler for event "WalletCreated"
   * @param data - Object from blockchain
   * @returns {Promise<void>}
   */
  async handleWalletCreate (data) {
    const walletDAO: MultisigWalletDAO = await multisigWalletService.createWalletDAO(data.returnValues.wallet, this.web3, this.history._address)
    const is2FA = await walletDAO.use2FA()
    await this._createWalletModel(data.returnValues.wallet, is2FA, data.transactionHash)
  }

  /**
   * handler for event "WalletRemoved"
   * @param data - Object from blockchain
   * @returns {Promise<void>}
   */
  handleWalletRemoved (data) {
    this.emit(EE_MS_WALLET_REMOVED, `${BLOCKCHAIN_ETHEREUM}-${data.returnValues.wallet}`)
  }

  //#endregion

  //#region Actions

  /**
   * fetch ethereum multisig wallets
   * @returns {Promise<void>}
   */
  async fetchWallets () {
    const res = await this.contract.methods.getWallets().call()
    const [addresses, is2FA] = Object.values(res)
    const validAddresses = addresses.filter((address) => !this.isEmptyAddress(address))
    this.emit(EE_MS_WALLETS_COUNT, validAddresses.length)

    validAddresses.forEach((address, i) => {
      this._createWalletModel(address.toLowerCase(), is2FA[i])
    })
  }

  /**
   * Create wallet model
   * @param address - string - wallet address
   * @param is2FA - boolean
   * @param transactionHash - string
   * @returns {Promise<void>}
   * @private
   */
  async _createWalletModel (address: string, is2FA: boolean, transactionHash: string) {
    const walletDAO: MultisigWalletDAO = await multisigWalletService.createWalletDAO(address, this.web3, this.history._address)
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

  /**
   * create wallet tx
   * @param wallet - MulMultisigEthWalletModel - wallet model from form
   */
  createWallet (wallet: MultisigEthWalletModel) {
    this._tx(
      'createWallet',
      [
        wallet.owners,
        wallet.requiredSignatures,
        Math.floor(wallet.releaseTime / 1000),
      ],
      new BigNumber(0),
      new BigNumber(0),
      {
        fields: wallet.toCreateWalletTx(),
        id: wallet.id,
      },
    )
  }

  /**
   * create 2fa wallet tx
   * @param wallet - MultisigEthWalletModel - wallet model from form
   * @param feeMultiplier - number - gas price multiplier
   * @returns {Promise<void>}
   */
  create2FAWallet (wallet: MultisigEthWalletModel, feeMultiplier) {
    this._tx(
      'create2FAWallet',
      [Math.floor(wallet.releaseTime() / 1000)],
      wallet.toCreateWalletTx(),
      null,
      { feeMultiplier },
    )
  }

  /**
   * get oracle price for account
   * @returns {Promise<any>}
   */
  getOraclePrice () {
    return this.contract.methods.getOraclePrice().call()
  }

  //#endregion

}
