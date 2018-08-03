/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from '../models/validator'
import { ContractsManagerABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import AssetsManagerDAO from './AssetsManagerDAO'
import ChronoBankAssetProxyDAO from './ChronoBankAssetProxyDAO'
import ChronoBankPlatformDAO from './ChronoBankPlatformDAO'
import ERC20DAO from './ERC20DAO'
import ERC20ManagerDAO from './ERC20ManagerDAO'
import FeeInterfaceDAO from './FeeInterfaceDAO'
import LOCManagerDAO from './LOCManagerDAO'
import PendingManagerDAO from './PendingManagerDAO'
import PlatformsManagerDAO from './PlatformsManagerDAO'
import PlatformTokenExtensionGatewayManagerEmitterDAO from './PlatformTokenExtensionGatewayManagerEmitterDAO'
import RewardsDAO from './RewardsDAO'
import AssetHolderDAO from './AssetHolderDAO'
import TokenManagementExtensionDAO from './TokenManagementExtensionDAO'
import UserManagerDAO from './UserManagerDAO'
import VotingManagerDAO from './VotingManagerDAO'
import PollInterfaceDAO from './PollInterfaceDAO'
import WalletsManagerDAO from './WalletsManagerDAO'
import { ExchangeDAO } from './ExchangeDAO'
import ExchangeManagerDAO from './ExchangeManagerDAO'
import ChronoBankAssetDAO from './ChronoBankAssetDAO'

const DAO_LOC_MANAGER = 'LOCManager'
const DAO_PENDING_MANAGER = 'PendingManager'
const DAO_USER_MANAGER = 'UserManager'
const DAO_WALLETS_MANAGER = 'WalletsManager'
const DAO_EXCHANGE_MANAGER = 'ExchangeManager'
const DAO_CHRONOBANK_ASSET = 'ChronoBankAsset'
const DAO_EXCHANGE = 'Exchange'
const DAO_ERC20_MANAGER = 'ERC20Manager'
const DAO_VOTING_MANAGER = 'VotingManager'
const DAO_POLL_INTERFACE = 'PollInterfaceDAO'
const DAO_REWARDS = 'Rewards'
const DAO_ASSETS_MANAGER = 'AssetsManager'
const DAO_PLATFORMS_MANAGER = 'PlatformsManager'
const DAO_CHRONOBANK_PLATFORM = 'ChronoBankPlatformDAO'
const DAO_TOKEN_MANAGEMENT_EXTENSION = 'TokenManagementExtension'
const DAO_PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER = 'PlatformTokenExtensionGatewayManagerEmitterDAO'
const DAO_CHRONOBANK_ASSET_PROXY = 'ChronoBankAssetProxyDAO'
const DAO_FEE_INTERFACE = 'FeeInterfaceDAO'
// TODO @dkchv: update after SC refactor
const DAO_ASSET_HOLDER = 'TimeHolder'

const DAO_ERC20 = 'erc20'

const daoMap = {
  [DAO_LOC_MANAGER]: LOCManagerDAO,
  [DAO_PENDING_MANAGER]: PendingManagerDAO,
  [DAO_USER_MANAGER]: UserManagerDAO,
  [DAO_WALLETS_MANAGER]: WalletsManagerDAO,
  [DAO_EXCHANGE_MANAGER]: ExchangeManagerDAO,
  [DAO_CHRONOBANK_ASSET]: ChronoBankAssetDAO,
  [DAO_EXCHANGE]: ExchangeDAO,
  // [ DAO_ERC20_MANAGER ]: ERC20ManagerDAO,
  [DAO_VOTING_MANAGER]: VotingManagerDAO,
  [DAO_POLL_INTERFACE]: PollInterfaceDAO,
  [DAO_REWARDS]: RewardsDAO,
  [DAO_ASSETS_MANAGER]: AssetsManagerDAO,
  [DAO_PLATFORMS_MANAGER]: PlatformsManagerDAO,
  [DAO_CHRONOBANK_PLATFORM]: ChronoBankPlatformDAO,
  [DAO_TOKEN_MANAGEMENT_EXTENSION]: TokenManagementExtensionDAO,
  [DAO_PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER]: PlatformTokenExtensionGatewayManagerEmitterDAO,
  [DAO_CHRONOBANK_ASSET_PROXY]: ChronoBankAssetProxyDAO,
  [DAO_FEE_INTERFACE]: FeeInterfaceDAO,
  [DAO_ASSET_HOLDER]: AssetHolderDAO,
  [DAO_ERC20]: ERC20DAO,
}

class ContractsManagerDAO extends AbstractContractDAO {
  _contracts = {}

  getContractAddressByType (type: string) {
    return this._call('getContractAddressByType', [type])
  }

  /** @private */
  async _getDAO (daoType: string, account = null, isNew = false): Promise<AbstractContractDAO> {
    if (!daoMap.hasOwnProperty(daoType)) {
      // return
      throw new Error(`invalid DAO type ${daoType}`)
    }

    account = account || await this.getContractAddressByType(daoType)

    const key = `${account}-${daoType}`
    if (this._contracts.hasOwnProperty(key)) {
      return this._contracts[key]
    }

    const DAOClass = daoMap[daoType]
    const dao = new DAOClass(account)

    if (isNew) {
      const isDeployed = await dao.isDeployed()
      if (!isDeployed) {
        throw new Error(`Can't init ${DAOClass.name} at ${account}; ${isDeployed.message}`)
      }
    }

    this._contracts[key] = dao
    return dao
  }

  getERC20ManagerDAO (): Promise<ERC20ManagerDAO> {
    return this._getDAO(DAO_ERC20_MANAGER)
  }

  getAssetsManagerDAO (): Promise<AssetsManagerDAO> {
    return this._getDAO(DAO_ASSETS_MANAGER)
  }

  getPlatformManagerDAO (): Promise<PlatformsManagerDAO> {
    return this._getDAO(DAO_PLATFORMS_MANAGER)
  }

  getChronoBankPlatformDAO (platformAddress): Promise<ChronoBankPlatformDAO> {
    return this._getDAO(DAO_CHRONOBANK_PLATFORM, platformAddress)
  }

  getChronoBankAssetProxyDAO (token: String): Promise<ChronoBankAssetProxyDAO> {
    return this._getDAO(DAO_CHRONOBANK_ASSET_PROXY, token)
  }

  async getFeeInterfaceDAO (address: String): Promise<FeeInterfaceDAO> {
    const chronoBankAssetProxyDAO = await this.getChronoBankAssetProxyDAO(address)
    const latestVersion = await chronoBankAssetProxyDAO.getLatestVersion()
    return this._getDAO(DAO_FEE_INTERFACE, latestVersion)
  }

  async getTokenManagementExtensionDAO (platformAddress): Promise<TokenManagementExtensionDAO> {
    if (platformAddress) {
      const assetsManager = await this._getDAO(DAO_ASSETS_MANAGER)
      const tokenExtensionString = await assetsManager.getTokenExtension(platformAddress)

      return this._getDAO(DAO_TOKEN_MANAGEMENT_EXTENSION, tokenExtensionString)
    } else {
      return this._getDAO(DAO_TOKEN_MANAGEMENT_EXTENSION)
    }
  }

  getPlatformTokenExtensionGatewayManagerEmitterDAO (): Promise<PlatformTokenExtensionGatewayManagerEmitterDAO> {
    return this._getDAO(DAO_PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER)
  }

  getRewardsDAO (): Promise<RewardsDAO> {
    return this._getDAO(DAO_REWARDS)
  }

  /**
   * @deprecated Use selector daoByType('TimeHolder')(state) instead
   */
  getAssetHolderDAO (): Promise<AssetHolderDAO> {
    // eslint-disable-next-line no-console
    console.warn('getAssetHolderDAO is deprecated')
    return this._getDAO(DAO_ASSET_HOLDER)
  }

  /**
   * @deprecated
   */
  async getTIMEDAO (): Promise<ERC20DAO> {
    const assetHolderDAO: AssetHolderDAO = await this.getAssetHolderDAO()
    return assetHolderDAO.getAssetDAO()
  }

  getPendingManagerDAO (): Promise<PendingManagerDAO> {
    return this._getDAO(DAO_PENDING_MANAGER)
  }

  getUserManagerDAO (): Promise<UserManagerDAO> {
    return this._getDAO(DAO_USER_MANAGER)
  }

  async getWalletsManagerDAO (): Promise<WalletsManagerDAO> {
    const walletManager = await this._getDAO(DAO_WALLETS_MANAGER)
    if (!walletManager.isInited()) {
      await walletManager.init()
    }
    return walletManager
  }

  getExchangeManagerDAO (): Promise<ExchangeManagerDAO> {
    return this._getDAO(DAO_EXCHANGE_MANAGER)
  }

  async getChronoBankAssetDAO (address): Promise<ChronoBankAssetDAO> {
    const chronoBankAssetProxyDAO = await this.getChronoBankAssetProxyDAO(address)
    const assetAddress = await chronoBankAssetProxyDAO.getLatestVersion()
    return this._getDAO(DAO_CHRONOBANK_ASSET, address ? assetAddress : null)
  }

  getExchangeDAO (tokenAddress): Promise<ExchangeDAO> {
    return this._getDAO(DAO_EXCHANGE, tokenAddress)
  }

  getLOCManagerDAO (): Promise<LOCManagerDAO> {
    return this._getDAO(DAO_LOC_MANAGER)
  }

  getVotingManagerDAO (): Promise<VotingManagerDAO> {
    return this._getDAO(DAO_VOTING_MANAGER)
  }

  getPollInterfaceDAO (address): Promise<PollInterfaceDAO> {
    return this._getDAO(DAO_POLL_INTERFACE, address)
  }

  async isContract (account): Promise<boolean> {
    return validator.address(account) === null
      ? await this.getCode(account) !== null
      : false
  }

  subscribeOnReset () {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    this._contracts = {}
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new ContractsManagerDAO(ContractsManagerABI)
