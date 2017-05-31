import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'
import DAORegistry from './DAORegistry'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/ERC20Manager.json'), at)
  }

  async initTokenMetaData (dao: ERC20DAO) {
    const address = await dao.getAddress()
    const data = await this._call('getTokenMetaData', [address])
    console.log('token data', data)
    dao.setName(data[1])
    dao.setSymbol(data[2])
    dao.setDecimals(data[4].toNumber())
    dao.initialized()
  }

  /** @returns {Promise.<ERC20DAO[]>} */
  async getTokens () {
    const addresses = await this._call('getTokenAddresses')
    const promises = []
    for (let address of addresses) {
      promises.push(DAORegistry.getERC20DAO(address))
    }
    return Promise.all(promises)
  }
}
