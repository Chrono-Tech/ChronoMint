import ERC20DAO from './ERC20DAO'
import ERC20ManagerDAO from './ERC20ManagerDAO'
import EmitterDAO from './EmitterDAO'
import PlatformEmitterDAO from './PlatformEmitterDAO'
import EventsHistoryDAO from './EventsHistoryDAO'
import LOCManagerDAO from './LOCManagerDAO'
import PendingManagerDAO from './PendingManagerDAO'
import UserManagerDAO from './UserManagerDAO'
import VoteDAO from './VoteDAO'
import TokenContractsDAO from './TokenContractsDAO'
import TIMEHolderDAO from './TIMEHolderDAO'
import RewardsDAO from './RewardsDAO'
import ExchangeDAO from './ExchangeDAO'

const DAO_EMITTER = 'emitter'
const DAO_PLATFORM_EMITTER = 'platformEmitter'
const DAO_ERC20 = 'erc20'
const DAO_ERC20_MANAGER = 'erc20Manager'
const DAO_PENDING_MANAGER = 'pendingManager'
const DAO_VOTE = 'vote'
const DAO_LOC_MANAGER = 'locManager'
const DAO_USER_MANAGER = 'userManager'
const DAO_TIME_HOLDER = 'timeHolder'
const DAO_REWARDS = 'rewards'
const DAO_EXCHANGE = 'exchange'

const contractTypes = {
  [DAO_LOC_MANAGER]: 0,
  [DAO_PENDING_MANAGER]: 1,
  [DAO_USER_MANAGER]: 2,
  [DAO_ERC20_MANAGER]: 3,
  [DAO_EXCHANGE]: 4,
  5: 5, // TrackersManager
  [DAO_VOTE]: 6,
  [DAO_REWARDS]: 7,
  8: 8, // AssetsManager
  [DAO_TIME_HOLDER]: 9
}

class DAORegistry {
  getDAOs () {
    let dao = {}
    dao[DAO_EMITTER] = EmitterDAO
    dao[DAO_PLATFORM_EMITTER] = PlatformEmitterDAO
    dao[DAO_ERC20] = ERC20DAO
    dao[DAO_ERC20_MANAGER] = ERC20ManagerDAO
    dao[DAO_PENDING_MANAGER] = PendingManagerDAO
    dao[DAO_LOC_MANAGER] = LOCManagerDAO
    dao[DAO_VOTE] = VoteDAO
    dao[DAO_USER_MANAGER] = UserManagerDAO
    dao[DAO_TIME_HOLDER] = TIMEHolderDAO
    dao[DAO_REWARDS] = RewardsDAO
    dao[DAO_EXCHANGE] = ExchangeDAO
    return dao
  }

  constructor () {
    // initialize contracts DAO storage with empty arrays
    this.contracts = {}
    const types = Object.keys(this.getDAOs())
    for (let key in types) {
      if (types.hasOwnProperty(key)) {
        this.contracts[types[key]] = []
      }
    }
  }

  /**
   * Should return DAO types for all other contracts.
   * @see AbstractOtherContractDAO
   * @returns {[number,string]}
   */
  getOtherDAOsTypes () {
    return [
      DAO_REWARDS,
      DAO_EXCHANGE
    ]
  }

  getDAO (dao: string, address: string, block = 'latest') {
    return new Promise(async (resolve, reject) => {
      const key = address + '-' + block
      if (!this.contracts.hasOwnProperty(dao)) {
        throw new Error('invalid DAO ' + dao)
      }
      if (this.contracts[dao].hasOwnProperty(key)) {
        return resolve(this.contracts[dao][key])
      }
      const DAOClass = this.getDAOs()[dao]
      this.contracts[dao][key] = new DAOClass(address)
      this.contracts[dao][key].setDefaultBlock(block)
      if (await this.contracts[dao][key].isDeployed()) {
        return resolve(this.contracts[dao][key])
      }
      delete this.contracts[dao][key]
      reject(new Error('Can\'t get ' + dao + ' contract, address ' + address + ', block ' + block))
    })
  }

  /** @returns {Promise.<ERC20ManagerDAO>} */
  async getERC20ManagerDAO () {
    const address = await TokenContractsDAO.getContractAddressByType(contractTypes[DAO_ERC20_MANAGER])
    return this.getDAO(DAO_ERC20_MANAGER, address)
  }

  /**
   * @param address
   * @param block number
   * @returns {Promise.<ERC20DAO|bool>}
   */
  async getERC20DAO (address: string, block = 'latest') {
    const dao: ERC20DAO = await this.getDAO(DAO_ERC20, address, block)
    if (!dao.isInitialized()) {
      const managerDAO = await this.getERC20ManagerDAO()
      await managerDAO.initTokenMetaData(dao)
    }
    return dao
  }

  /** @returns {Promise.<ERC20DAO>} */
  async getERC20DAOBySymbol (symbol: string) {
    const managerDAO = await this.getERC20ManagerDAO()
    let address = await managerDAO.getTokenAddressBySymbol(symbol)
    address = Array.isArray(address) ? address[0] : address // TODO @sashaaro: expect return only address string
    return this.getERC20DAO(address)
  }

  /** @returns {Promise.<RewardsDAO|bool>} */
  async getRewardsDAO () {
    const address = await TokenContractsDAO.getContractAddressByType(contractTypes[DAO_REWARDS])
    return this.getDAO(DAO_REWARDS, address)
  }

  /** @returns {Promise.<ExchangeDAO|bool>} */
  async getExchangeDAO () {
    const address = await TokenContractsDAO.getContractAddressByType(contractTypes[DAO_EXCHANGE])
    return this.getDAO(DAO_EXCHANGE, address)
  }

  /** @returns {Promise.<TIMEHolderDAO|bool>} */
  async getTIMEHolderDAO () {
    const address = await TokenContractsDAO.getContractAddressByType(contractTypes[DAO_TIME_HOLDER])
    return this.getDAO(DAO_TIME_HOLDER, address)
  }

  /** @returns {Promise.<ERC20DAO|bool>} */
  async getTIMEDAO () {
    const timeHolderDAO: TIMEHolderDAO = await this.getTIMEHolderDAO()
    return timeHolderDAO.getAssetDAO()
  }

  /** @returns {Promise.<PendingManagerDAO>} */
  async getPendingManagerDAO () {
    const address = await TokenContractsDAO.getContractAddressByType(contractTypes[DAO_PENDING_MANAGER])
    return this.getDAO(DAO_PENDING_MANAGER, address)
  }

  /** @returns {Promise.<UserManagerDAO>} */
  async getUserManagerDAO () {
    const address = await TokenContractsDAO.getContractAddressByType(contractTypes[DAO_USER_MANAGER])
    return this.getDAO(DAO_USER_MANAGER, address)
  }

  /** @returns {Promise.<UserManagerDAO>} */
  async getLOCManagerDAO () {
    const address = await TokenContractsDAO.getContractAddressByType(contractTypes[DAO_LOC_MANAGER])
    return this.getDAO(DAO_LOC_MANAGER, address)
  }

  /** @returns {Promise.<VoteDAO>} */
  async getVoteDAO () {
    const address = await TokenContractsDAO.getContractAddressByType(contractTypes[DAO_VOTE])
    return this.getDAO(DAO_VOTE, address)
  }

  async getContractsManagerDAO () {
    return TokenContractsDAO
  }

  /** @returns {Promise.<EmitterDAO>} */
  async getEmitterDAO () {
    const address = await EventsHistoryDAO.getAddress()
    return this.getDAO(DAO_EMITTER, address)
  }

  /** @returns {Promise.<PlatformEmitterDAO>} */
  async getPlatformEmitterDAO () {
    const address = await EventsHistoryDAO.getAddress()
    return this.getDAO(DAO_PLATFORM_EMITTER, address)
  }
}

export default new DAORegistry()
