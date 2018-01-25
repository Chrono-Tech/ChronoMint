import AbstractContractDAO from 'dao/AbstractContractDAO'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import type MultisigWalletDAO from 'dao/MultisigWalletDAO'
import AddressesCollection from 'models/wallet/AddressesCollection'
import AddressModel from 'models/wallet/AddressModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import multisigWalletService from 'services/MultisigWalletService'
import { MultiEventsHistoryABI, WalletsManagerABI } from './abi'

export const EVENT_NEW_MS_WALLET = 'newMSWallet'
export const EVENT_MS_WALLETS_COUNT = 'msWalletCount'

export default class WalletsManagerDAO extends AbstractContractDAO {

  constructor (at) {
    super(WalletsManagerABI, at, MultiEventsHistoryABI)
    this._isInit = false
  }

  isInited () {
    return this._isInit
  }

  async init () {
    await this.watchWalletCreate()
    this._isInit = true
  }

  // ---------- watchers ---------

  watchWalletCreate () {
    return this._watch(
      'WalletCreated',
      (result) => this._createWalletModel(result.args.wallet, false, result.transactionHash),
      { by: this.getAccount() },
    )
  }

  // --------- actions ----------

  async fetchWallets () {
    const [ addresses, is2FA ] = await this._call('getWallets')
    const validAddresses = addresses.filter((address) => !this.isEmptyAddress(address))
    this.emit(EVENT_MS_WALLETS_COUNT, validAddresses.length)

    validAddresses.forEach((address, i) => {
      this._createWalletModel(address, is2FA[ i ])
    })
  }

  _createOwnersCollection (owners: Array, account) {
    let ownersCollection = new OwnerCollection()
    owners.forEach((address) => {
      ownersCollection = ownersCollection.update(new OwnerModel({
        address,
        isSelf: account === address,
      }))
    })
    return ownersCollection
  }

  async _createWalletModel (address, is2FA, transactionHash) {
    const walletDAO: MultisigWalletDAO = await multisigWalletService.createWalletDAO(address)
    const [ owners, requiredSignatures, pendingTxList, releaseTime ] = await Promise.all([
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

    const multisigWalletModel = new MultisigWalletModel({
      address,
      owners: this._createOwnersCollection(owners, address),
      transactionHash,
      requiredSignatures,
      is2FA,
      isFetched: true,
      pendingTxList,
      addresses,
      releaseTime,
    })
    this.emit(EVENT_NEW_MS_WALLET, multisigWalletModel)
  }

  async createWallet (wallet: MultisigWalletModel) {
    const owners = wallet.owners().items().map((item) => item.address())

    const result = await this._tx('createWallet', [
      owners,
      wallet.requiredSignatures(),
      Math.floor(wallet.releaseTime() / 1000),
    ], wallet.toCreateWalletTx())
    return result.tx
  }
}
