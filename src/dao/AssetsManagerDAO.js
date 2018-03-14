import Immutable from 'immutable'
import web3Converter from 'utils/Web3Converter'
import web3Provider from '@chronobank/login/network/Web3Provider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import BigNumber from 'bignumber.js'
import contractManager from 'dao/ContractsManagerDAO'
import TxModel from 'models/TxModel'
import { unionBy } from 'lodash'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import { TXS_PER_PAGE } from 'models/wallet/TransactionsCollection'
import BlacklistModel from 'models/tokens/BlacklistModel'
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

  async getSystemAssetsForOwner (account: string) {

    const assetList = await ethereumProvider.getEventsData('mint/assets', `account='${account}'`)
    const assetListObject = {}
    if (assetList && assetList.length) {
      for (const asset of assetList) {
        assetListObject[ asset.token ] = { ...asset, address: asset.token }
      }
    }

    return assetListObject
  }

  async getPlatformList (userAddress: string) {
    const minePlatforms = await ethereumProvider.getEventsData('PlatformRequested', `by='${userAddress}'`, (e) => {
      return { address: e.platform, by: e.by, name: null }
    })
    const mineAssets = await ethereumProvider.getEventsData('mint/assets', `account='${userAddress}'`, (e) => {
      return { address: e.platform, by: e.by, name: null }
    })

    return unionBy(minePlatforms, mineAssets, 'address')
  }

  getManagers (symbols: Array<string>) {
    return ethereumProvider.getEventsData('mint/managerListByToken', symbols.map((item) => {
      return `symbol[]='${item}'`
    }).join('&'))
  }

  async getManagersForAssetSymbol (symbol) {
    const managersListForSymbol = await this.getManagers([ symbol ])

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
      symbol: tx.args.symbol && web3Converter.bytesToString(tx.args.symbol).toUpperCase(),
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

    let map = new Immutable.Map()
    transactions.map((tx) => map = map.set(tx.id(), tx))
    return map
  }

  subscribeOnMiddleware (event: string, callback) {
    ethereumProvider.subscribeOnMiddleware(event, callback)
  }

  getEventsData (eventName: string, queryFilter: string, mapCallback) {
    ethereumProvider.getEventsData(eventName, queryFilter, mapCallback)
  }

  async getBlacklist (symbol: string) {
    const blacklist = await ethereumProvider.getEventsData(`mint/blacklist`, `symbol='${web3Converter.stringToBytesWithZeros(symbol)}'`)
    return new BlacklistModel({ list: new Immutable.List(blacklist) })
  }
}
