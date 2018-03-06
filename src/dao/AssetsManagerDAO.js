import web3Provider from '@chronobank/login/network/Web3Provider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import BigNumber from 'bignumber.js'
import contractManager from 'dao/ContractsManagerDAO'
import TxModel from 'models/TxModel'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import { TXS_PER_PAGE } from 'models/wallet/TransactionsCollection'
import Web3Converter from 'utils/Web3Converter'
import { AssetsManagerABI, MultiEventsHistoryABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import { TX_ISSUE, TX_OWNERSHIP_CHANGE, TX_REVOKE } from './ChronoBankPlatformDAO'
import { TX_PLATFORM_ATTACHED, TX_PLATFORM_DETACHED, TX_PLATFORM_REQUESTED } from './PlatformsManagerDAO'

export const TX_ASSET_CREATED = 'AssetCreated'

export default class AssetsManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(AssetsManagerABI, at, MultiEventsHistoryABI)
  }

  getTokenExtension (platform) {
    return this._call('getTokenExtension', [ platform ])
  }

  async getSystemAssetsForOwner (owner) {
    return {}

    const [ addresses, platforms, totalSupply ] = await this._call('getSystemAssetsForOwner', [ owner ])

    let assetsList = {}
    let currentPlatform
    addresses.map((address, i) => {
      if (!this.isEmptyAddress(platforms[ i ])) {
        currentPlatform = platforms[ i ]
      }

      assetsList[ address ] = {
        address,
        platform: currentPlatform,
        totalSupply: totalSupply[ i ],
      }

    })
    return assetsList
  }

  async getPlatformList (userAddress: string) {
    return ethereumProvider.getPlatformList(userAddress)
  }

  async getManagers (owner) {
    return {}

    const managersList = await this._call('getManagers', [ owner ])
    let formatManagersList = {}
    managersList.map((manager) => {
      if (!this.isEmptyAddress(manager) && !formatManagersList[ manager ]) {
        formatManagersList[ manager ] = manager
      }
    })

    return Object.keys(formatManagersList)
  }

  async getManagersForAssetSymbol (symbol) {
    const managersListForSymbol = await this._call('getManagersForAssetSymbol', [ symbol ])

    let formatManagersList = new OwnerCollection()
    managersListForSymbol.map((address) => {
      if (this.isEmptyAddress(address)) {
        return
      }
      formatManagersList = formatManagersList.add(new OwnerModel({ address }))
    })
    return formatManagersList
  }

  createTxModel (tx, account, block, time): TxModel {
    const gasPrice = new BigNumber(tx.gasPrice)
    return new TxModel({
      txHash: tx.transactionHash,
      type: tx.event,
      blockHash: tx.blockHash,
      blockNumber: block,
      transactionIndex: tx.transactionIndex,
      from: tx.args.from,
      by: tx.args.by,
      to: tx.args.to,
      value: tx.args.value,
      gas: tx.gas,
      gasPrice,
      time,
      symbol: tx.args.symbol && Web3Converter.bytesToString(tx.args.symbol).toUpperCase(),
      tokenAddress: tx.args.token,
      args: tx.args,
    })
  }

  async getTxModel (tx, account, block = null, time = null): Promise<?TxModel> {
    const txDetails = await web3Provider.getTransaction(tx.transactionHash)
    tx.gasPrice = txDetails.gasPrice
    tx.gas = txDetails.gas

    if (block && time) {
      return this.createTxModel(tx, account, block, time)
    }
    block = await web3Provider.getBlock(tx.blockHash)
    return this.createTxModel(tx, account, tx.blockNumber, block.timestamp)
  }

  async getTransactions (account) {
    const transactionsPromises = []
    const platformManagerDao = await contractManager.getPlatformManagerDAO()
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO()
    const platformTokenExtensionGatewayManagerDAO = await contractManager.getPlatformTokenExtensionGatewayManagerEmitterDAO()

    transactionsPromises.push(platformTokenExtensionGatewayManagerDAO._get(TX_ASSET_CREATED, 0, 'latest', { by: account }, TXS_PER_PAGE))
    transactionsPromises.push(platformManagerDao._get(TX_PLATFORM_REQUESTED, 0, 'latest', { by: account }, TXS_PER_PAGE, 'test'))
    transactionsPromises.push(platformManagerDao._get(TX_PLATFORM_ATTACHED, 0, 'latest', { by: account }, TXS_PER_PAGE))
    transactionsPromises.push(platformManagerDao._get(TX_PLATFORM_DETACHED, 0, 'latest', { by: account }, TXS_PER_PAGE))
    transactionsPromises.push(chronoBankPlatformDAO._get(TX_ISSUE, 0, 'latest', { by: account }, TXS_PER_PAGE))
    transactionsPromises.push(chronoBankPlatformDAO._get(TX_REVOKE, 0, 'latest', { by: account }, TXS_PER_PAGE))
    transactionsPromises.push(chronoBankPlatformDAO._get(TX_OWNERSHIP_CHANGE, 0, 'latest', { to: account }))
    transactionsPromises.push(chronoBankPlatformDAO._get(TX_OWNERSHIP_CHANGE, 0, 'latest', { from: account }))
    const transactionsLists = await Promise.all(transactionsPromises)
    const promises = []
    transactionsLists.map((transactionsList) => transactionsList.map((tx) => promises.push(this.getTxModel(tx, account))))
    const transactions = await Promise.all(promises)
    return transactions
  }
}
