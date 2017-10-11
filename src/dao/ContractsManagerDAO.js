import type Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'
import ERC20ManagerDAO from './ERC20ManagerDAO'
import AssetsManagerDAO from './AssetsManagerDAO'
import PlatformsManagerDAO from './PlatformsManagerDAO'
import TokenManagementExtensionDAO from './TokenManagementExtensionDAO'
import OwnedInterfaceDAO from './OwnedInterfaceDAO'
import LOCManagerDAO from './LOCManagerDAO'
import PendingManagerDAO from './PendingManagerDAO'
import UserManagerDAO from './UserManagerDAO'
import WalletsManagerDAO from './WalletsManagerDAO'
import VotingDAO from './VotingDAO'
import VotingDetailsDAO from './VotingDetailsDAO'
import VotingActorDAO from './VotingActorDAO'
import TIMEHolderDAO from './TIMEHolderDAO'
import RewardsDAO from './RewardsDAO'

import validator from 'components/forms/validator'
import type TokenModel from 'models/TokenModel'

const DAO_LOC_MANAGER = 'LOCManager'
const DAO_PENDING_MANAGER = 'PendingManager'
const DAO_USER_MANAGER = 'UserManager'
const DAO_WALLETS_MANAGER = 'WalletsManager'
const DAO_ERC20_MANAGER = 'ERC20Manager'
const DAO_VOTING = 'PollManager'
const DAO_VOTING_DETAILS = 'PollDetails'
const DAO_VOTING_ACTOR = 'VoteActor'
const DAO_REWARDS = 'Rewards'
const DAO_ASSETS_MANAGER = 'AssetsManager'
const DAO_PLATFORMS_MANAGER = 'PlatformsManager'
const DAO_TOKEN_MANAGEMENT_EXTENSION = 'TokenManagementExtension'
const DAO_OWNED_INTERFACE = 'OwnedInterface'
const DAO_TIME_HOLDER = 'TimeHolder'

const DAO_ERC20 = 'erc20'

const daoMap = {
  [DAO_LOC_MANAGER]: LOCManagerDAO,
  [DAO_PENDING_MANAGER]: PendingManagerDAO,
  [DAO_USER_MANAGER]: UserManagerDAO,
  [DAO_WALLETS_MANAGER]: WalletsManagerDAO,
  [DAO_ERC20_MANAGER]: ERC20ManagerDAO,
  [DAO_VOTING]: VotingDAO,
  [DAO_VOTING_DETAILS]: VotingDetailsDAO,
  [DAO_VOTING_ACTOR]: VotingActorDAO,
  [DAO_REWARDS]: RewardsDAO,
  [DAO_ASSETS_MANAGER]: AssetsManagerDAO,
  [DAO_PLATFORMS_MANAGER]: PlatformsManagerDAO,
  [DAO_TOKEN_MANAGEMENT_EXTENSION]: TokenManagementExtensionDAO,
  [DAO_OWNED_INTERFACE]: OwnedInterfaceDAO,
  [DAO_TIME_HOLDER]: TIMEHolderDAO,
  [DAO_ERC20]: ERC20DAO
}

class ContractsManagerDAO extends AbstractContractDAO {
  _contracts = {}

  getContractAddressByType (type: string) {
    return this._call('getContractAddressByType', [type])
  }

  /** @private */
  async _getDAO (daoType: string, account = null, isNew = false, block = 'latest'): Promise<AbstractContractDAO> {
    if (!daoMap.hasOwnProperty(daoType)) {
      throw new Error('invalid DAO type ' + daoType)
    }

    account = account || await this.getContractAddressByType(daoType)

    const key = account + '-' + block
    if (this._contracts.hasOwnProperty(key)) {
      return this._contracts[key]
    }

    const DAOClass = daoMap[daoType]
    const dao = new DAOClass(account)
    dao.setDefaultBlock(block)

    if (isNew) {
      const isDeployed = await dao.isDeployed()
      if (!isDeployed) {
        throw new Error('Can\'t init ' + DAOClass.name + ' at ' + account + '-' + block + '; ' + isDeployed.message)
      }
    }

    this._contracts[key] = dao
    return dao
  }

  async getERC20ManagerDAO (): Promise<ERC20ManagerDAO> {
    return this._getDAO(DAO_ERC20_MANAGER)
  }

  // noinspection JSUnusedGlobalSymbols
  async getAssetsManagerDAO (): Promise<AssetsManagerDAO> {
    return this._getDAO(DAO_ASSETS_MANAGER)
  }

  // noinspection JSUnusedGlobalSymbols
  async getPlatformManagerDAO (): Promise<PlatformsManagerDAO> {
    return this._getDAO(DAO_PLATFORMS_MANAGER)
  }

  // noinspection JSUnusedGlobalSymbols
  async getTokenManagementExtensionDAO (): Promise<TokenManagementExtensionDAO> {
    return this._getDAO(DAO_TOKEN_MANAGEMENT_EXTENSION)
  }

  // noinspection JSUnusedGlobalSymbols
  async getOwnedInterfaceDAO (account): Promise<OwnedInterfaceDAO> {
    return this._getDAO(DAO_OWNED_INTERFACE, account)
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
          dao.initMetaData()
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

  async getRewardsDAO (): Promise<RewardsDAO> {
    return this._getDAO(DAO_REWARDS)
  }

  async getTIMEHolderDAO (): Promise<TIMEHolderDAO> {
    return this._getDAO(DAO_TIME_HOLDER)
  }

  async getTIMEDAO (): Promise<ERC20DAO> {
    const timeHolderDAO: TIMEHolderDAO = await this.getTIMEHolderDAO()
    return timeHolderDAO.getAssetDAO()
  }

  async getPendingManagerDAO (): Promise<PendingManagerDAO> {
    return this._getDAO(DAO_PENDING_MANAGER)
  }

  async getUserManagerDAO (): Promise<UserManagerDAO> {
    return this._getDAO(DAO_USER_MANAGER)
  }

  async getWalletsManagerDAO (): Promise<WalletsManagerDAO> {
    return this._getDAO(DAO_WALLETS_MANAGER)
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

  async getVotingDAO (): Promise<VotingDAO> {
    const dao = await this._getDAO(DAO_VOTING)
    await dao.initMetaData()
    return dao
  }

  async getVotingDetailsDAO (): Promise<VotingDetailsDAO> {
    return await this._getDAO(DAO_VOTING_DETAILS)
  }

  async getVotingActorDAO (): Promise<VotingActorDAO> {
    return await this._getDAO(DAO_VOTING_ACTOR)
  }

  async isContract (account): Promise<boolean> {
    return validator.address(account) === null ?
      await this.getCode(account) !== null : false
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

export default new ContractsManagerDAO(require('chronobank-smart-contracts/build/contracts/ContractsManager.json'))
