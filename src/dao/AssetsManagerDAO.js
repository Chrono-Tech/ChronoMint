import contractManager from 'dao/ContractsManagerDAO'
import Web3Converter from 'utils/Web3Converter'
import TxModel from 'models/TxModel'
import web3Provider from 'network/Web3Provider'
import BigNumber from 'bignumber.js'
import AbstractContractDAO from './AbstractContractDAO'

const TX_PLATFORM_REQUESTED = 'PlatformRequested'
const TX_PLATFORM_ATTACHED = 'PlatformAttached'
const TX_ISSUE = 'Issue'
const TX_REVOKE = 'Revoke'
const TX_OWNERSHIP_CHANGE = 'OwnershipChange'
const TX_LOG_ADD_TOKEN = 'LogAddToken'
const TXS_PER_PAGE = 10
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export default class AssetsManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/AssetsManager.json'), at)
  }

  getTokenExtension (platform) {
    return this._call('getTokenExtension', [platform])
  }

  async getAssetsForOwner (owner) {
    const assets = await this._call('getAssetsForOwner', [owner, owner])

    let assetsList = {}
    let currentPlatform
    for (let i = 0; i < assets[0].length; i++) {

      if (assets[1][i] !== ZERO_ADDRESS) currentPlatform = assets[1][i]

      assetsList[assets[0][i]] = {
        address: assets[0][i],
        platform: currentPlatform,
        totalSupply: assets[2][i],
      }
    }
    return assetsList
  }

  async getManagers (owner) {
    const managersList = await this._call('getManagers', [owner])
    let formatManagersList = {}
    managersList.map(manager => {
      if (manager !== ZERO_ADDRESS && !formatManagersList[manager]) {
        formatManagersList[manager] = manager
      }
    })

    return Object.keys(formatManagersList)
  }

  async getManagersForAssetSymbol (symbol) {
    const managersListForSymbol = await this._call('getManagersForAssetSymbol', [symbol])

    let formatManagersList = {}
    managersListForSymbol.map(manager => {
      if (manager !== ZERO_ADDRESS && !formatManagersList[manager]) {
        formatManagersList[manager] = manager
      }
    })
    return Object.keys(formatManagersList)
  }


  createTxModel (tx, account, block, time): TxModel {
    const gasPrice = new BigNumber(tx.gasPrice)

    return new TxModel({
      txHash: tx.transactionHash,
      type: tx.event,
      blockHash: tx.blockHash,
      blockNumber: block,
      transactionIndex: tx.transactionIndex,
      from: tx.args.by || account,
      to: tx.args.to,
      value: tx.args.value,
      gas: tx.gas,
      gasPrice,
      time,
      symbol: tx.args.symbol && Web3Converter.bytesToString(tx.args.symbol),
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

  async getTransactions (platforms, account) {
    const transactionsPromises = []
    const platformManagerDao = await contractManager.getPlatformManagerDAO()
    transactionsPromises.push(platformManagerDao._get(TX_PLATFORM_REQUESTED, 0, 'latest', {from: account}, TXS_PER_PAGE))
    transactionsPromises.push(platformManagerDao._get(TX_PLATFORM_ATTACHED, 0, 'latest', {from: account}, TXS_PER_PAGE))
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO()
    transactionsPromises.push(chronoBankPlatformDAO._get(TX_ISSUE, 0, 'latest', {from: account}, TXS_PER_PAGE))
    transactionsPromises.push(chronoBankPlatformDAO._get(TX_REVOKE, 0, 'latest', {from: account}, TXS_PER_PAGE))
    transactionsPromises.push(chronoBankPlatformDAO._get(TX_OWNERSHIP_CHANGE, 0, 'latest', {from: account}, TXS_PER_PAGE))
    /*for (let platform of  platforms) {
      const tokenManagementExtensionDAO = await contractManager.getTokenManagementExtensionDAO(platform.address)
      transactionsPromises.push(tokenManagementExtensionDAO._get('AssetCreated', 0, 'latest', {}, TXS_PER_PAGE))
    }*/
    const ERC20ManagerDAO = await contractManager.getERC20ManagerDAO()
    transactionsPromises.push(ERC20ManagerDAO._get(TX_LOG_ADD_TOKEN, 0, 'latest', {from: account}, TXS_PER_PAGE))
    const transactionsLists = await Promise.all(transactionsPromises)

    const promises = []
    transactionsLists.map(transactionsList => transactionsList.map(tx => promises.push(this.getTxModel(tx, account))))
    return Promise.all(promises)
  }


  /** @private */
  _watchCallback = (callback, isRemoved = false, isAdded = true) => async (result, block, time) => {
    // eslint-disable-next-line
    console.log('--AssetsManagerDAO#: result, block, time', result, block, time)
  }
}
