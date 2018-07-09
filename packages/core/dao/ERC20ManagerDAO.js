/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenNoticeModel from '../models/notices/TokenNoticeModel'
import TokenModel from '../models/tokens/TokenModel'
import AbstractContractDAO from '../refactor/daos/lib/AbstractContractDAO'
import ethereumDAO, { BLOCKCHAIN_ETHEREUM } from './EthereumDAO'

export const TX_ADD_TOKEN = 'addToken'
export const TX_MODIFY_TOKEN = 'setToken'
export const TX_REMOVE_TOKEN = 'removeTokenByAddress'

export const EVENT_NEW_ERC20_TOKEN = 'erc20/newToken'
export const EVENT_ERC20_TOKENS_COUNT = 'erc20/count'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  /**
   * Tokens fetching and emmit token
   * @param tokenAddresses
   * @returns {Promise<void>}
   */
  async fetchTokens (tokenAddresses = []) {
    const res = await this.contract.methods.getTokens(tokenAddresses).call()
    const [addresses, names, symbols, urls, decimalsArr, ipfsHashes] = Object.values(res)

    this.emit(EVENT_ERC20_TOKENS_COUNT, addresses.length)
    const feeRate = await ethereumDAO.getGasPrice()

    addresses.forEach((address, i) => {
      const symbol = this._c.bytesToString(symbols[i]).toUpperCase()
      const model = new TokenModel({
        address,
        name: this._c.bytesToString(names[i]),
        symbol,
        url: this._c.bytesToString(urls[i]),
        decimals: parseInt(decimalsArr[i]),
        icon: this._c.bytes32ToIPFSHash(ipfsHashes[i]),
        isFetched: true,
        blockchain: BLOCKCHAIN_ETHEREUM,
        isERC20: true,
        feeRate: this._c.toWei(this._c.fromWei(feeRate), 'gwei'), // gas price in gwei
      })

      this.emit(EVENT_NEW_ERC20_TOKEN, model)
    })
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
      token.name() || '',
      token.symbol(),
      token.url() || '',
      token.decimals(),
      token.icon() ? this._c.ipfsHashToBytes32(token.icon()) : null,
      '', // swarm hash
    ]
  }

  /** @private */
  _setTokenSummary (token: TokenModel) {
    return {
      address: token.address(),
      name: token.name() || '',
      symbol: token.symbol(),
      url: token.url() || '',
      decimals: token.decimals(),
    }
  }

  /**
   * For all users
   */
  addToken (token: TokenModel) {
    const summary = this._setTokenSummary(token)
    return this._tx(TX_ADD_TOKEN, this._setTokenParams(token), summary)
  }

  /**
   * Only for CBE
   */
  modifyToken (oldToken: TokenModel, newToken: TokenModel) {
    const summary = this._setTokenSummary(newToken)
    return this._tx(TX_MODIFY_TOKEN, [oldToken.address(), ...this._setTokenParams(newToken)], summary)
  }

  /**
   * Only for CBE
   */
  removeToken (token: TokenModel) {
    const summary = this._setTokenSummary(token)
    return this._tx(TX_REMOVE_TOKEN, [token.address()], summary)
  }

  /** @private */
  _watchCallback = (callback, isRemoved = false, isAdded = true) => async (result, block, time) => {
    const symbol = this._c.bytesToString(result.args.symbol).toUpperCase()
    callback(new TokenNoticeModel(
      new TokenModel({
        address: result.args.token,
        name: this._c.bytesToString(result.args.name),
        symbol,
        url: this._c.bytesToString(result.args.url),
        decimals: result.args.decimals.toNumber(),
        icon: this._c.bytes32ToIPFSHash(result.args.ipfsHash),
        blockchain: BLOCKCHAIN_ETHEREUM,
        isERC20: true,
        isFetched: true,
      }),
      time, isRemoved, isAdded, result.transactionHash || null,
    ))
  }

  watchAdd (callback) {
    return this._watch('LogAddToken', this._watchCallback(callback))
  }

  watchModify (callback, account) {
    return this._watch('LogTokenChange', this._watchCallback(callback, false, false), { from: account })
  }

  watchRemove (callback, account) {
    return this._watch('LogRemoveToken', this._watchCallback(callback, true), { from: account })
  }
}
