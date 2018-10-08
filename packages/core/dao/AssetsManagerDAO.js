/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Map, List } from 'immutable'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { unionBy } from 'lodash'
import OwnerCollection from '../models/wallet/OwnerCollection'
import OwnerModel from '../models/wallet/OwnerModel'
import BlacklistModel from '../models/tokens/BlacklistModel'
import AbstractContractDAO from './AbstractContractDAO'
import ChronoBankPlatformDAO from './ChronoBankPlatformDAO'
import ChronoBankAssetDAO from './ChronoBankAssetDAO'
import PlatformsManagerDAO from './PlatformsManagerDAO'
import PlatformTokenExtensionGatewayManagerEmitterDAO from './PlatformTokenExtensionGatewayManagerEmitterDAO'
import web3Converter from '../utils/Web3Converter'
import { daoByType } from '../../core/redux/daos/selectors'
import assetsManagerService from '../services/AssetsManagerService'

export default class AssetsManagerDAO extends AbstractContractDAO {

  constructor ({ address, history, abi }) {
    super({ address, history, abi })

    this.chronobankPlatformDAO = null
    this.platformTokenExtensionGatewayManagerEmitterDAO = null
    this.platformsManagerDAO = null
    this.chronobankAssetDAO = null

  }

  connect (web3, options = {}) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData)
  }

  /**
   *
   * @param state
   * @param web3
   * @param history
   */
  postStoreDispatchSetup (state) {
    const platformsManagerDAO = daoByType('PlatformsManager')(state)
    const chronobankPlatformDAO = daoByType('ChronoBankPlatform')(state)
    const chronobankAsset = daoByType('ChronoBankAsset')(state)
    const PlatformTokenExtensionGatewayManagerEmitterDAO = daoByType('PlatformTokenExtensionGatewayManagerEmitterDAO')(state)

    this.setPlatformsManagerDAO(platformsManagerDAO)
    this.setChronobankAssetDAO(chronobankAsset)
    this.setChronobankPlatformDAO(chronobankPlatformDAO)
    this.setPlatformTokenExtensionGatewayManagerEmitterDAO(PlatformTokenExtensionGatewayManagerEmitterDAO)
  }

  /**
   * Adds PlatformTokenExtensionGatewayManagerEmitterDAO
   * @param platformTokenExtensionGatewayManagerEmitterDAO
   */
  setPlatformTokenExtensionGatewayManagerEmitterDAO (platformTokenExtensionGatewayManagerEmitterDAO: PlatformTokenExtensionGatewayManagerEmitterDAO) {
    this.platformTokenExtensionGatewayManagerEmitterDAO = platformTokenExtensionGatewayManagerEmitterDAO
  }

  /**
   * Adds platformsManagerDAO
   * @param platformsManagerDAO
   */
  setPlatformsManagerDAO (platformsManagerDAO: PlatformsManagerDAO) {
    this.platformsManagerDAO = platformsManagerDAO
  }

  /**
   * Adds chronobankPlatformDAO
   * @param chronobankPlatformDAO
   */
  setChronobankPlatformDAO (chronobankPlatformDAO: ChronoBankPlatformDAO) {
    this.chronobankPlatformDAO = chronobankPlatformDAO
  }

  /**
   * Adds chronobankPlatformDAO
   * @param chronobankPlatformDAO
   */
  setChronobankAssetDAO (chronobankAssetDAO: ChronoBankAssetDAO) {
    this.chronobankAssetDAO = chronobankAssetDAO
  }

  /**
   *
   * @param platform
   * @returns {Promise<any>}
   */
  getTokenExtension (platform) {
    return this.contract.methods.getTokenExtension(platform).call()
  }

  async getSystemAssetsForOwner (account: string) {

    const assetList = await ethereumProvider.getEventsData('mint/assets', `account='${account}'`)
    const assetListObject = {}
    if (assetList && assetList.length) {
      for (const asset of assetList) {
        assetListObject[asset.token] = { ...asset, address: asset.token }
      }
    }
    return assetListObject
  }

  async getAssetDataBySymbol (symbol: string) {
    const [asset] = await ethereumProvider.getEventsData('mint/asset', `symbol='${web3Converter.stringToBytesWithZeros(symbol)}'`)
    asset.address = asset.token
    return asset
  }

  async getPlatformList (userAddress: string) {
    let minePlatforms = []
    let mineAssets = []
    try {
      minePlatforms = await ethereumProvider.getEventsData('PlatformRequested', `by='${userAddress}'`, (e) => {
        return { address: e.platform, by: e.by, name: null }
      })
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e)
    }

    try {
      mineAssets = await ethereumProvider.getEventsData('mint/assets', `account='${userAddress}'`, (e) => {
        return { address: e.platform, by: e.by, name: null }
      })
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e)
    }

    unionBy(minePlatforms, mineAssets, 'address')
      .forEach((platform) => assetsManagerService.getChronoBankPlatformDAO(platform.address, this.web3, this.history._address))

    return unionBy(minePlatforms, mineAssets, 'address')
  }

  async getManagers (symbols: Array<string>, excludeAccounts: Array<string> = []) {
    const managerList = await ethereumProvider.getEventsData('mint/managerListByToken', symbols.map((item) => {
      return `symbol[]='${item}'`
    }).join('&'))
    return managerList.filter((m) => !excludeAccounts.includes(m))
  }

  async getManagersForAssetSymbol (symbol: string, excludeAccounts: Array<string> = []) {
    const managersListForSymbol = await this.getManagers([symbol], excludeAccounts)
    let formatManagersList = new OwnerCollection()
    managersListForSymbol.map((address) => {
      formatManagersList = formatManagersList.add(new OwnerModel({ address }))
    })
    return formatManagersList
  }

  /**
   * Implement for transactions list
   * @returns {}
   */
  getTxModel () {
    return {}
  }

  subscribeOnMiddleware (event: string, callback) {
    ethereumProvider.subscribeOnMiddleware(event, callback)
  }

  getEventsData (eventName: string, queryFilter: string, mapCallback) {
    ethereumProvider.getEventsData(eventName, queryFilter, mapCallback)
  }

  async getBlacklist (symbol: string) {
    const blacklist = await ethereumProvider.getEventsData(`mint/blacklist`, `symbol='${web3Converter.stringToBytesWithZeros(symbol)}'`)
    return new BlacklistModel({ list: new List(blacklist) })
  }

  // TODO @Abdulov remove this how txHash will be arrive from Middleware
  async getTransactionsForBlacklists (address, symbol, account) {
    const transactionsPromises = []

    // transactionsPromises.push(this.chronobankAssetDAO._get(TX_RESTRICTED, 0, 'latest', { symbol }))
    // transactionsPromises.push(this.chronobankAssetDAO._get(TX_UNRESTRICTED, 0, 'latest', { symbol }))

    const transactionsLists = await Promise.all(transactionsPromises)
    const promises = []
    transactionsLists.map((transactionsList) => transactionsList.map((tx) => promises.push(this.getTxModel(tx, account))))
    const transactions = await Promise.all(promises)

    let map = new Map()
    transactions.map((tx) => map = map.set(tx.id(), tx))
    return map
  }

  // TODO @Abdulov remove this how txHash will be arrive from Middleware
  async getTransactionsForBlockAsset (address, symbol, account) {
    const transactionsPromises = []

    // transactionsPromises.push(this.chronobankAssetDAO._get(TX_PAUSED, 0, 'latest', { symbol }))
    // transactionsPromises.push(this.chronobankAssetDAO._get(TX_UNPAUSED, 0, 'latest', { symbol }))

    const transactionsLists = await Promise.all(transactionsPromises)
    const promises = []
    transactionsLists.map((transactionsList) => transactionsList.map((tx) => promises.push(this.getTxModel(tx, account))))
    const transactions = await Promise.all(promises)

    let map = new Map()
    transactions.map((tx) => map = map.set(tx.id(), tx))
    return map
  }

  getFeeInterfaceDAO (address) {
    return assetsManagerService.getFeeInterfaceDAO(address, this.web3, this.history._address)
  }

  getChronoBankAssetDAO (address) {
    return assetsManagerService.getChronoBankAssetDAO(address, this.web3, this.history._address)
  }
}
