import validator from 'components/forms/validator'
import type Immutable from 'immutable'
import type TokenModel from 'models/TokenModel'
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
import TIMEHolderDAO from './TIMEHolderDAO'
import TokenManagementExtensionDAO from './TokenManagementExtensionDAO'
import UserManagerDAO from './UserManagerDAO'
import VotingActorDAO from './VotingActorDAO'
import VotingDAO from './VotingDAO'
import VotingDetailsDAO from './VotingDetailsDAO'
import VotingManagerDAO from './VotingManagerDAO'
import WalletsManagerDAO from './MultisigWalletsManagerDAO'
import { ExchangeDAO } from './ExchangeDAO'
import ExchangeManagerDAO from './ExchangeManagerDAO'

const DAO_LOC_MANAGER = 'LOCManager'
const DAO_PENDING_MANAGER = 'PendingManager'
const DAO_USER_MANAGER = 'UserManager'
const DAO_WALLETS_MANAGER = 'WalletsManager'
const DAO_EXCHANGE_MANAGER = 'ExchangeManager'
const DAO_EXCHANGE = 'Exchange'
const DAO_ERC20_MANAGER = 'ERC20Manager'
const DAO_VOTING = 'PollManager'
const DAO_VOTING_DETAILS = 'PollDetails'
const DAO_VOTING_MANAGER = 'VotingManager'
const DAO_VOTING_ACTOR = 'VoteActor'
const DAO_REWARDS = 'Rewards'
const DAO_ASSETS_MANAGER = 'AssetsManager'
const DAO_PLATFORMS_MANAGER = 'PlatformsManager'
const DAO_CHRONOBANK_PLATFORM = 'ChronoBankPlatformDAO'
const DAO_TOKEN_MANAGEMENT_EXTENSION = 'TokenManagementExtension'
const DAO_PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER = 'PlatformTokenExtensionGatewayManagerEmitterDAO'
const DAO_CHRONOBANK_ASSET_PROXY = 'ChronoBankAssetProxyDAO'
const DAO_FEE_INTERFACE = 'FeeInterfaceDAO'
const DAO_TIME_HOLDER = 'TimeHolder'

const DAO_ERC20 = 'erc20'

const daoMap = {
  [DAO_LOC_MANAGER]: LOCManagerDAO,
  [DAO_PENDING_MANAGER]: PendingManagerDAO,
  [DAO_USER_MANAGER]: UserManagerDAO,
  [DAO_WALLETS_MANAGER]: WalletsManagerDAO,
  [DAO_EXCHANGE_MANAGER]: ExchangeManagerDAO,
  [DAO_EXCHANGE]: ExchangeDAO,
  [DAO_ERC20_MANAGER]: ERC20ManagerDAO,
  [DAO_VOTING]: VotingDAO,
  [DAO_VOTING_DETAILS]: VotingDetailsDAO,
  [DAO_VOTING_MANAGER]: VotingManagerDAO,
  [DAO_VOTING_ACTOR]: VotingActorDAO,
  [DAO_REWARDS]: RewardsDAO,
  [DAO_ASSETS_MANAGER]: AssetsManagerDAO,
  [DAO_PLATFORMS_MANAGER]: PlatformsManagerDAO,
  [DAO_CHRONOBANK_PLATFORM]: ChronoBankPlatformDAO,
  [DAO_TOKEN_MANAGEMENT_EXTENSION]: TokenManagementExtensionDAO,
  [DAO_PLATFORM_TOKEN_EXTENSION_GATEWAY_MANAGER_EMITTER]: PlatformTokenExtensionGatewayManagerEmitterDAO,
  [DAO_CHRONOBANK_ASSET_PROXY]: ChronoBankAssetProxyDAO,
  [DAO_FEE_INTERFACE]: FeeInterfaceDAO,
  [DAO_TIME_HOLDER]: TIMEHolderDAO,
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

  async getERC20DAO (account, isNew = false, isInitialized = false): Promise<ERC20DAO> {
    const dao: ERC20DAO = await this._getDAO(DAO_ERC20, account, isNew)
    if (!dao.isInitialized() && !isInitialized) {
      if (!isNew) {
        const managerDAO = await this.getERC20ManagerDAO()
        await managerDAO.initTokenMetaData(dao)
      } else {
        await Promise.all([
          dao.totalSupply(),
          dao.initMetaData(),
        ])
      }
    }
    return dao
  }

  // noinspection JSUnusedGlobalSymbols
  async getERC20DAOBySymbol (symbol: string): Promise<ERC20DAO> {
    const managerDAO = await this.getERC20ManagerDAO()
    const address = await managerDAO.getTokenAddressBySymbol(symbol)
    return this.getERC20DAO(address)
  }

  getRewardsDAO (): Promise<RewardsDAO> {
    return this._getDAO(DAO_REWARDS)
  }

  getTIMEHolderDAO (): Promise<TIMEHolderDAO> {
    return this._getDAO(DAO_TIME_HOLDER)
  }

  async getTIMEDAO (): Promise<ERC20DAO> {
    const timeHolderDAO: TIMEHolderDAO = await this.getTIMEHolderDAO()
    return timeHolderDAO.getAssetDAO()
  }

  getPendingManagerDAO (): Promise<PendingManagerDAO> {
    return this._getDAO(DAO_PENDING_MANAGER)
  }

  getUserManagerDAO (): Promise<UserManagerDAO> {
    return this._getDAO(DAO_USER_MANAGER)
  }

  getWalletsManagerDAO (): Promise<WalletsManagerDAO> {
    return this._getDAO(DAO_WALLETS_MANAGER)
  }

  getExchangeManagerDAO (): Promise<ExchangeManagerDAO> {
    return this._getDAO(DAO_EXCHANGE_MANAGER)
  }

  getExchangeDAO (tokenAddress): Promise<ExchangeDAO> {
    return this._getDAO(DAO_EXCHANGE, tokenAddress)
  }

  async getLOCManagerDAO (): Promise<LOCManagerDAO> {
    const locManager = await this._getDAO(DAO_LOC_MANAGER)
    if (!locManager.isInitialized()) {
      const ercManager = await this.getERC20ManagerDAO()
      const tokens: Immutable.Map<TokenModel> = await ercManager.getLOCTokens()
      locManager.setTokens(tokens)
      locManager.isInitialized(true)
    }
    return locManager
  }

  getVotingDAO (): Promise<VotingDAO> {
    return this._getDAO(DAO_VOTING)
  }

  getVotingDetailsDAO (): Promise<VotingDetailsDAO> {
    return this._getDAO(DAO_VOTING_DETAILS)
  }

  getVotingManagerDAO (): Promise<VotingManagerDAO> {
    return this._getDAO(DAO_VOTING_MANAGER)
  }

  getVotingActorDAO (): Promise<VotingActorDAO> {
    return this._getDAO(DAO_VOTING_ACTOR)
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
