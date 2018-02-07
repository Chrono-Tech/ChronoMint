import TokenNoticeModel from 'models/notices/TokenNoticeModel'
import TokenModel from 'models/tokens/TokenModel'
import { ERC20ManagerABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import ethereumDAO, { BLOCKCHAIN_ETHEREUM } from './EthereumDAO'

export const TX_ADD_TOKEN = 'addToken'
export const TX_MODIFY_TOKEN = 'setToken'
export const TX_REMOVE_TOKEN = 'removeToken'

export const MANDATORY_TOKENS = [ 'TIME', 'ETH' ]
export const DEFAULT_TOKENS = [ 'TIME', 'ETH', 'BTC', 'BCC', 'BTG', 'LTC', 'XEM', 'XMIN' ]

export const EVENT_NEW_ERC20_TOKEN = 'erc20/newToken'
export const EVENT_ERC20_TOKENS_COUNT = 'erc20/count'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(ERC20ManagerABI, at)
  }

  async fetchTokens (tokenAddresses = []) {
    const [ addresses, names, symbols, urls, decimalsArr, ipfsHashes ] = await this._call('getTokens', [ tokenAddresses ])
    this.emit(EVENT_ERC20_TOKENS_COUNT, addresses.length)
    const feeRate = await ethereumDAO.getGasPrice()

    addresses.forEach((address, i) => {
      const symbol = this._c.bytesToString(symbols[ i ]).toUpperCase()

      this.emit(EVENT_NEW_ERC20_TOKEN, new TokenModel({
        address,
        name: this._c.bytesToString(names[ i ]),
        symbol,
        url: this._c.bytesToString(urls[ i ]),
        decimals: decimalsArr[ i ].toNumber(),
        icon: this._c.bytes32ToIPFSHash(ipfsHashes[ i ]),
        isOptional: !MANDATORY_TOKENS.includes(symbol),
        isFetched: true,
        blockchain: BLOCKCHAIN_ETHEREUM,
        isERC20: true,
        feeRate: this._c.toWei(this._c.fromWei(feeRate), 'gwei'), // gas price in gwei
      }))
    })
  }

  async getTokenAddressBySymbol (symbol: string): string | null {
    if (!symbol) {
      return null
    }
    const address = await this._call('getTokenAddressBySymbol', [ symbol ])
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
      '', // swarm hash
    ]
  }

  /** @private */
  _setTokenSummary (token: TokenModel) {
    return {
      address: token.address(),
      name: token.name(),
      symbol: token.symbol(),
      url: token.url(),
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
    return this._tx(TX_MODIFY_TOKEN, [ oldToken.address(), ...this._setTokenParams(newToken) ], summary)
  }

  /**
   * Only for CBE
   */
  removeToken (token: TokenModel) {
    const summary = this._setTokenSummary(token)
    return this._tx(TX_REMOVE_TOKEN, [ token.address() ], summary)
  }

  /** @private */
  _watchCallback = (callback, isRemoved = false, isAdded = true) => async (result, block, time) => {
    callback(new TokenNoticeModel(
      new TokenModel({
        address: result.args.token,
        name: this._c.bytesToString(result.args.name),
        symbol: this._c.bytesToString(result.args.symbol).toUpperCase(),
        url: this._c.bytesToString(result.args.url),
        decimals: result.args.decimals.toNumber(),
        icon: this._c.bytes32ToIPFSHash(result.args.ipfsHash),
        blockchain: BLOCKCHAIN_ETHEREUM,
        isERC20: true,
      }),
      time, isRemoved, isAdded, result.args.oldToken || null,
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
