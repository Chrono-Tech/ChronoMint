import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'
import ERC20ManagerDAO from './ERC20ManagerDAO'
import AssetsManagerDAO from './AssetsManagerDAO'
import LOCManagerDAO from './LOCManagerDAO'
import PendingManagerDAO from './PendingManagerDAO'
import UserManagerDAO from './UserManagerDAO'
import VoteDAO from './VoteDAO'
import TIMEHolderDAO from './TIMEHolderDAO'
import RewardsDAO from './RewardsDAO'
import ExchangeDAO from './ExchangeDAO'
import AssetDonator from './AssetDonator'

const DAO_LOC_MANAGER = 0
const DAO_PENDING_MANAGER = 1
const DAO_USER_MANAGER = 2
const DAO_ERC20_MANAGER = 3
const DAO_EXCHANGE = 4
// const DAO_TRACKERS_MANAGER = 5
const DAO_VOTE = 6
const DAO_REWARDS = 7
const DAO_ASSETS_MANAGER = 8
const DAO_TIME_HOLDER = 9
const DAO_ASSET_DONATOR = 10

const DAO_ERC20 = 'erc20'

const daoMap = {
  [DAO_LOC_MANAGER]: LOCManagerDAO,
  [DAO_PENDING_MANAGER]: PendingManagerDAO,
  [DAO_USER_MANAGER]: UserManagerDAO,
  [DAO_ERC20_MANAGER]: ERC20ManagerDAO,
  [DAO_EXCHANGE]: ExchangeDAO,
  [DAO_VOTE]: VoteDAO,
  [DAO_REWARDS]: RewardsDAO,
  [DAO_ASSETS_MANAGER]: AssetsManagerDAO,
  [DAO_TIME_HOLDER]: TIMEHolderDAO,
  [DAO_ASSET_DONATOR]: AssetDonator,
  [DAO_ERC20]: ERC20DAO
}

class ContractsManagerDAO extends AbstractContractDAO {
  _contracts = {}

  handleWeb3Reset () {
    this._contracts = {}
    super.handleWeb3Reset()
  }

  getContractAddressByType (type: number) {
    return this._call('getContractAddressByType', [type])
  }

  /** @private */
  async _getDAO (daoType: string, address: string = null, isNew = false,
                 checkCodeConsistency = true, block = 'latest'): Promise<AbstractContractDAO> {
    if (!daoMap.hasOwnProperty(daoType)) {
      throw new Error('invalid DAO type ' + daoType)
    }

    address = address || await this.getContractAddressByType(daoType)

    const key = address + '-' + block
    if (this._contracts.hasOwnProperty(key)) {
      return this._contracts[key]
    }

    const DAOClass = daoMap[daoType]
    const dao = new DAOClass(address)
    dao.setDefaultBlock(block)

    if (isNew) {
      const isDeployed = await dao.isDeployed(checkCodeConsistency)
      if (!isDeployed) {
        throw new Error('Can\'t init ' + DAOClass.name + ' at ' + address + '-' + block + '; ' + isDeployed.message)
      }
    }

    this._contracts[key] = dao
    return dao
  }

  async getERC20ManagerDAO (): Promise<ERC20ManagerDAO> {
    return this._getDAO(DAO_ERC20_MANAGER)
  }

  async getAssetsManagerDAO (): Promise<AssetsManagerDAO> {
    return this._getDAO(DAO_ASSETS_MANAGER)
  }

  async getERC20DAO (address: string, isNew = false, isInitialized = false): Promise<ERC20DAO> {
    const dao: ERC20DAO = await this._getDAO(DAO_ERC20, address, isNew, !isNew)
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

  async getERC20DAOBySymbol (symbol: string): Promise<ERC20DAO> {
    const managerDAO = await this.getERC20ManagerDAO()
    const address = await managerDAO.getTokenAddressBySymbol(symbol)
    return this.getERC20DAO(address)
  }

  async getRewardsDAO (): Promise<RewardsDAO> {
    return this._getDAO(DAO_REWARDS)
  }

  async getExchangeDAO (): Promise<ExchangeDAO> {
    return this._getDAO(DAO_EXCHANGE)
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

  async getLOCManagerDAO (): Promise<LOCManagerDAO> {
    return this._getDAO(DAO_LOC_MANAGER)
  }

  async getVoteDAO (): Promise<VoteDAO> {
    return this._getDAO(DAO_VOTE)
  }

  async getAssetDonator (): Promise<AssetDonator> {
    return this._getDAO(DAO_ASSET_DONATOR)
  }
}

export default new ContractsManagerDAO(require('chronobank-smart-contracts/build/contracts/ContractsManager.json'))
