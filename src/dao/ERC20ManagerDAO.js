import Immutable from 'immutable'

import AbstractContractDAO from './AbstractContractDAO'
import ERC20DAO from './ERC20DAO'
import ethereumDAO, { EthereumDAO } from './EthereumDAO'
import TokenModel from 'models/TokenModel'
import TokenNoticeModel from 'models/notices/TokenNoticeModel'

import lhtDAO from './LHTDAO'
import contractsManagerDAO from './ContractsManagerDAO'
import { TIME } from './TIMEHolderDAO'

export const TX_ADD_TOKEN = 'addToken'
export const TX_MODIFY_TOKEN = 'setToken'
export const TX_REMOVE_TOKEN = 'removeToken'

const EVENT_TOKEN_ADD = 'LogAddToken'
const EVENT_TOKEN_MODIFY = 'LogTokenChange'
const EVENT_TOKEN_REMOVE = 'LogRemoveToken'

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

  async getTokens (tokenAddresses: Array<String> = []): Immutable.Map<TokenModel> {

    let map = new Immutable.Map()

    const [addresses, names, symbols, urls, decimalsArr, ipfsHashes] = await this._getTokens(tokenAddresses)

    for (let [i, address] of Object.entries(addresses)) {
      const token = new TokenModel({
        address,
        name: names[i],
        symbol: symbols[i],
        url: urls[i],
        decimals: decimalsArr[i],
        icon: ipfsHashes[i]
      })
      map = map.set(token.id(), token)
    }

    return map
  }

  /**
   * ETH, TIME will be added by flag isWithObligatory
   */
  async _getTokensByAddresses (addresses: Array = [], isWithObligatory = true): Immutable.Map<TokenModel> {
    let timeDAO
    if (isWithObligatory) {
      // add TIME address to filters
      timeDAO = await contractsManagerDAO.getTIMEDAO()
      addresses.push(timeDAO.getInitAddress())
    }
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
      promises.push(dao.getAccountBalance('pending'))
    }
    const balances = await Promise.all(promises)

    // prepare result
    let map = new Immutable.Map()

    if (isWithObligatory) {
      // add ETH to result map
      const ethToken = new TokenModel({
        dao: ethereumDAO,
        name: EthereumDAO.getName(),
        balance: await ethereumDAO.getAccountBalance('pending')
      })
      map = map.set(ethToken.id(), ethToken)
    }
    const timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
    const timeHolderAddress = timeHolderDAO.getInitAddress()

    for (let [i, address] of Object.entries(tokensAddresses)) {
      this.initTokenMetaData(daos[i], symbols[i], decimalsArr[i])
      const token = new TokenModel({
        address,
        dao: daos[i],
        name: names[i],
        symbol: symbols[i],
        url: urls[i],
        decimals: decimalsArr[i],
        icon: ipfsHashes[i],
        balance: balances[i]
      })
      map = map.set(token.id(),
        token.symbol() === TIME ? token.setAllowance(
          timeHolderAddress,
          await timeDAO.getAccountAllowance(timeHolderAddress)
        ) : token)
    }

    return map
  }

  /**
   * With ETH, TIME (because they are obligatory) and balances for each token.
   */
  getUserTokens (addresses: Array = []) {
    return this._getTokensByAddresses(addresses, true)
  }

  async getTokenAddressBySymbol (symbol: string): string | null {
    if (!symbol) {
      return null
    }
    const address = await this._call('getTokenAddressBySymbol', [symbol])
    return this.isEmptyAddress(address) ? null : address
  }

  /** @private */
  _setTokenParams (token: TokenModel) {
    return [
      token.address(),
      token.name(),
      token.symbol(),
      token.url(),
      token.decimals(),
      token.icon() ? this._c.ipfsHashToBytes32(token.icon()) : null,
      '' // swarm hash
    ]
  }

  /**
   * For all users
   */
  async addToken (token: TokenModel) {
    return this._tx(TX_ADD_TOKEN, this._setTokenParams(token), token)
  }

  /**
   * Only for CBE
   */
  async modifyToken (oldToken: TokenModel, newToken: TokenModel) {
    return this._tx(TX_MODIFY_TOKEN, [oldToken.address(), ...this._setTokenParams(newToken)], newToken)
  }

  /**
   * Only for CBE
   */
  async removeToken (token: TokenModel) {
    return this._tx(TX_REMOVE_TOKEN, [token.address()], token)
  }

  /**
   * Only for LOC
   */
  async getLOCTokens () {
    // TODO @dkchv: for now LHT only
    const lhtAddress = await lhtDAO.getAddress()
    return this._getTokensByAddresses([lhtAddress], false)
  }

  /** @private */
  _watchCallback = (callback, isRemoved = false, isAdded = true) => (result, block, time) => {

    /** @namespace result.args.ipfsHash */

    callback(new TokenNoticeModel(
      new TokenModel({
        address: result.args.token,
        name: this._c.bytesToString(result.args.name),
        symbol: this._c.bytesToString(result.args.symbol),
        url: this._c.bytesToString(result.args.url),
        decimals: result.args.decimals.toNumber(),
        icon: this._c.bytes32ToIPFSHash(result.args.ipfsHash)
      }),
      time, isRemoved, isAdded, result.args['oldToken'] || null
    ))
  }

  async watchAdd (callback) {
    return this._watch(EVENT_TOKEN_ADD, this._watchCallback(callback))
  }

  async watchModify (callback) {
    return this._watch(EVENT_TOKEN_MODIFY, this._watchCallback(callback, false, false))
  }

  async watchRemove (callback) {
    return this._watch(EVENT_TOKEN_REMOVE, this._watchCallback(callback, true))
  }
}
