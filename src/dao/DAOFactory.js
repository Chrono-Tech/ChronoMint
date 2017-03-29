import AssetDAO from './AssetDAO'
import ProxyDAO from './ProxyDAO'
import {RewardsDAO} from './RewardsDAO'
import {ExchangeDAO} from './ExchangeDAO'

const DAO_PROXY = 'proxy'
const DAO_ASSET = 'asset'
const DAO_REWARDS = 'rewards'
const DAO_EXCHANGE = 'exchange'

class DAOFactory {
  getDAOs () {
    let dao = {}
    dao[DAO_PROXY] = ProxyDAO
    dao[DAO_ASSET] = AssetDAO
    dao[DAO_REWARDS] = RewardsDAO
    dao[DAO_EXCHANGE] = ExchangeDAO
    return dao
  };

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
   * @return {[number,string]}
   */
  getOtherDAOsTypes () {
    return [
      DAO_REWARDS,
      DAO_EXCHANGE
    ]
  };

  initDAO (dao: string, address: string, block = 'latest') {
    return new Promise((resolve, reject) => {
      const key = address + '-' + block
      if (this.contracts[dao].hasOwnProperty(key)) {
        resolve(this.contracts[dao][key])
      }
      const DAOClass = this.getDAOs()[dao]
      this.contracts[dao][key] = new DAOClass(address)
      this.contracts[dao][key].web3.eth.defaultBlock = block
      this.contracts[dao][key].contract.then(() => {
        resolve(this.contracts[dao][key])
      }).catch(e => {
        reject(e)
      })
    })
  };

  /**
   * Initialize AssetDAO or return already initialized if exists
   * @param address
   * @return {Promise.<AssetDAO|bool>} promise dao or false for invalid contract address case
   */
  initAssetDAO (address: string) {
    return this.initDAO(DAO_ASSET, address)
  };

  /**
   * Initialize ProxyDAO or return already initialized if exists
   * @param address
   * @param block number
   * @return {Promise.<ProxyDAO|bool>} promise dao or false for invalid contract address case
   */
  initProxyDAO (address: string, block = 'latest') {
    return this.initDAO(DAO_PROXY, address, block)
  };

  /**
   * Initialize RewardsDAO or return already initialized if exists
   * @param address
   * @return {Promise.<RewardsDAO|bool>} promise dao or false for invalid contract address case
   */
  initRewardsDAO (address: string) {
    return this.initDAO(DAO_REWARDS, address)
  }

  /**
   * Initialize ExchangeDAO or return already initialized if exists
   * @param address
   * @return {Promise.<ExchangeDAO|bool>} promise dao or false for invalid contract address case
   */
  initExchangeDAO (address: string) {
    return this.initDAO(DAO_EXCHANGE, address)
  }
}

export default new DAOFactory()
