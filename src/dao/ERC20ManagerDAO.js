import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'
import EthereumDAO from './EthereumDAO'
import ContractsManagerDAO from './ContractsManagerDAO'
import LS from '../utils/LocalStorage'
import TokenModel from '../models/TokenModel'

const TX_ADD_TOKEN = 'addToken'
const TX_REMOVE_TOKEN = 'removeToken'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/ERC20Manager.json'), at)
  }

  async initTokenMetaData (dao: ERC20DAO) {
    const address = await dao.getAddress()
    const data = await this._call('getTokenMetaData', [address])
    dao.setName(this._c.bytesToString(data[1]))
    dao.setSymbol(this._c.bytesToString(data[2]))
    dao.setDecimals(data[4].toNumber())
    dao.initialized()
  }

  /**
   * @param eth if true, then map will starts with the...
   * @see EthereumDAO token model
   * @param balance if true, then each model will be filled with current account balance
   * @param addresses
   * @returns {Promise<Immutable.Map<string(symbol),TokenModel>>}
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
    for (let dao of tokens) {
      map = map.set(dao.getSymbol(), new TokenModel(dao))

      if (balance) {
        promises.push(dao.getAccountBalance(LS.getAccount()))
      }
    }

    const balances = await Promise.all(promises)
    let i = 0
    for (let dao of tokens) {
      map = map.set(dao.getSymbol(), map.get(dao.getSymbol()).set('balance', balances[i]))
      i++
    }

    return map
  }

  async getTokenAddressBySymbol (symbol: string): string | null {
    if (!symbol) {
      return null
    }
    const address = await this._call('getTokenAddressBySymbol', [symbol])
    return this.isEmptyAddress(address) ? null : address
  }

  saveToken(token: TokenModel) {
    return this._tx(TX_ADD_TOKEN, [
      token.address(),
      token.name(),
      token.symbol(),
      token.url(),
      token.decimals(),
      token.icon(),
      '' // swarm hash
    ], token)
  }

  removeToken (token: TokenModel) {
    return this._tx(TX_REMOVE_TOKEN, [token.address()], token)
  }
}
