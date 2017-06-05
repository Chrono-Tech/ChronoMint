import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'
import EthereumDAO from './EthereumDAO'
import ContractsManagerDAO from './ContractsManagerDAO'
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

  /**
   * @param eth if true, then map will starts with the...
   * @see EthereumDAO token model
   * @param balance if true, then each model will be filled with current account balance
   * @param addresses
   * @returns {Promise.<Immutable.Map.<string(symbol),TokenModel>>}
   */
  async getTokens (eth = true, balance = true, addresses = []) {
    let map = new Immutable.Map()

    if (eth) {
      map = map.set(
        EthereumDAO.getSymbol(),
        new TokenModel(
          EthereumDAO,
          balance ? await EthereumDAO.getAccountBalance(LS.getAccount()) : null
        )
      )
    }

    const allAddresses = await this._call('getTokenAddresses')
    let promises = []
    for (let address of allAddresses) {
      if (addresses.includes(address) || addresses.length === 0) {
        promises.push(ContractsManagerDAO.getERC20DAO(address))
      }
    }
    const tokens = await Promise.all(promises)

    promises = []
    for (let token of tokens) {
      map = map.set(token.getSymbol(), new TokenModel(token))

      if (balance) {
        promises.push(token.getAccountBalance(LS.getAccount()))
      }
    }

    const balances = await Promise.all(promises)
    let i = 0
    for (let token of tokens) {
      map = map.set(token.getSymbol(), map.get(token.getSymbol()).set('balance', balances[i]))
      i++
    }

    return map
  }

  async getTokenAddressBySymbol (symbol: string) {
    return this._call('getTokenAddressBySymbol', [symbol])
  }
}
