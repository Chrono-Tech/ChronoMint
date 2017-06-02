import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'
import EthereumDAO from './EthereumDAO'
import DAORegistry from './DAORegistry'
import LS from '../utils/LocalStorage'
import TokenModel from '../models/TokenModel'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/ERC20Manager.json'), at)
  }

  async initTokenMetaData (dao: ERC20DAO) {
    const address = await dao.getAddress()
    const data = await this._call('getTokenMetaData', [address])
    dao.setName(data[1])
    dao.setSymbol(data[2])
    dao.setDecimals(data[4].toNumber())
    dao.initialized()
  }

  /** @returns {Promise.<Immutable.Map.<string(symbol),TokenModel>>} */
  async getTokens () {
    let map = new Immutable.Map()
    map = map.set(
      EthereumDAO.getSymbol(),
      new TokenModel(
        EthereumDAO,
        await EthereumDAO.getAccountBalance(LS.getAccount())
      )
    )

    const addresses = await this._call('getTokenAddresses')
    let promises = []
    for (let address of addresses) {
      promises.push(DAORegistry.getERC20DAO(address))
    }
    const tokens = await Promise.all(promises)

    promises = []
    for (let token of tokens) {
      map = map.set(token.getSymbol(), new TokenModel(token))
      promises.push(token.getAccountBalance(LS.getAccount()))
    }

    const balances = await Promise.all(promises)
    let i = 0
    for (let token of tokens) {
      map = map.set(token.getSymbol(), map.get(token.getSymbol()).set('balance', balances[i]))
      i++
    }

    return map
  }
}
