import Immutable from 'immutable'

import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'
import TokenModel from '../models/TokenModel'

import ethereumDAO from './EthereumDAO'
import contractsManagerDAO from './ContractsManagerDAO'
import ls from '../utils/LocalStorage'

export const TX_ADD_TOKEN = 'addToken'
export const TX_MODIFY_TOKEN = 'setToken'
export const TX_REMOVE_TOKEN = 'removeToken'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/ERC20Manager.json'), at)
  }

  async initTokenMetaData (dao: ERC20DAO, symbol = null, decimals = null) {
    if (!symbol) {
      const address = await dao.getAddress()
      const data = await this._call('getTokenMetaData', [address])
      symbol = this._c.bytesToString(data[2])
      decimals = data[4].toNumber()
    }
    dao.setSymbol(symbol)
    dao.setDecimals(decimals)
    dao.initialized()
  }

  async _getTokens (addresses = []) {
    const [tokensAddresses, names, symbols, urls, decimalsArr, ipfsHashes] = await this._call('getTokens', [addresses])

    for (let [i, name] of Object.entries(names)) {
      names[i] = this._c.bytesToString(name)
      symbols[i] = this._c.bytesToString(symbols[i])
      urls[i] = this._c.bytesToString(urls[i])
      decimalsArr[i] = decimalsArr[i].toNumber()
      ipfsHashes[i] = this._c.bytes32ToIPFSHash(ipfsHashes[i])
    }

    return [tokensAddresses, names, symbols, urls, decimalsArr, ipfsHashes]
  }

  async getTokens () {
    let map = new Immutable.Map()

    const [addresses, names, symbols, urls, decimalsArr, ipfsHashes] = await this._getTokens()

    for (let [i, address] of Object.entries(addresses)) {
      map = map.set(symbols[i], new TokenModel({
        address,
        name: names[i],
        symbol: symbols[i],
        url: urls[i],
        decimals: decimalsArr[i],
        icon: ipfsHashes[i] // TODO @bshevchenko: need fix after MINT-277 Improve FileSelect
      }))
    }

    return map
  }

  /**
   * With ETH, TIME (because they are obligatory) and balances for each token.
   * @param addresses
   * @returns {Promise<Immutable.Map<string(symbol),TokenModel>>}
   */
  async getUserTokens (addresses = []) {
    // add TIME address to filters
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    addresses.push(timeDAO.getInitAddress())

    // get data
    const [tokensAddresses, names, symbols, urls, decimalsArr, ipfsHashes] = await this._getTokens(addresses)

    // init DAOs
    let promises = []
    for (let address of tokensAddresses) {
      promises.push(contractsManagerDAO.getERC20DAO(address, false, true))
    }
    const daos = await Promise.all(promises)

    // get balances
    promises = []
    for (let dao of daos) {
      promises.push(dao.getAccountBalance(ls.getAccount()))
    }
    const balances = await Promise.all(promises)

    // prepare result
    let map = new Immutable.Map()

    // add ETH to result map
    map = map.set(
      ethereumDAO.getSymbol(),
      new TokenModel({
        dao: ethereumDAO,
        name: 'Ethereum',
        balance: await ethereumDAO.getAccountBalance(ls.getAccount(), 'pending')
      })
    )

    for (let [i, address] of Object.entries(tokensAddresses)) {
      this.initTokenMetaData(daos[i], symbols[i], decimalsArr[i])
      map = map.set(symbols[i], new TokenModel({
        address,
        dao: daos[i],
        name: names[i],
        symbol: symbols[i],
        url: urls[i],
        decimals: decimalsArr[i],
        icon: ipfsHashes[i], // TODO @bshevchenko: need fix after MINT-277 Improve FileSelect
        balance: balances[i]
      }))
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

  /**
   * For all users
   */
  async addToken (token: TokenModel) {
    return this._tx(TX_ADD_TOKEN, [
      token.address(),
      token.name(),
      token.symbol(),
      token.url(),
      token.decimals(),
      token.icon() ? this._c.ipfsHashToBytes32(token.icon()) : null,
      '' // swarm hash
    ], token)
  }

  /**
   * Only for CBE
   */
  async modifyToken (oldToken: TokenModel, newToken: TokenModel) {
    return this._tx(TX_MODIFY_TOKEN, [
      oldToken.address(),
      newToken.address(),
      newToken.name(),
      newToken.symbol(),
      newToken.url(),
      newToken.decimals(),
      newToken.icon() ? this._c.ipfsHashToBytes32(newToken.icon()) : null,
      '' // swarm hash
    ], newToken)
  }

  /**
   * Only for CBE
   */
  async removeToken (token: TokenModel) {
    return this._tx(TX_REMOVE_TOKEN, [token.address()], token)
  }
}
