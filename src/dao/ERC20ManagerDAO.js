import TokenManagementExtensionDAO from 'dao/TokenManagementExtensionDAO'
import Immutable from 'immutable'
import TokensCollection from 'models/exchange/TokensCollection'
import TokenNoticeModel from 'models/notices/TokenNoticeModel'
import TokenModel from 'models/tokens/TokenModel'
import { ERC20ManagerABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import { bccDAO, btcDAO, btgDAO, ltcDAO } from './BitcoinDAO'
import contractsManagerDAO from './ContractsManagerDAO'
import ERC20DAO from './ERC20DAO'
import ethereumDAO, { EthereumDAO } from './EthereumDAO'
import lhtDAO from './LHTDAO'
import { TIME } from './TIMEHolderDAO'

export const TX_ADD_TOKEN = 'addToken'
export const TX_MODIFY_TOKEN = 'setToken'
export const TX_REMOVE_TOKEN = 'removeToken'

const MANDATORY_TOKENS = [ 'TIME' ]
const NON_OPTIONAL_TOKENS = [ 'ETH', 'TIME', 'BTC', 'BCC', 'BTG', 'LTC' ]

export const EVENT_NEW_ERC20_TOKEN = 'erc20/newToken'
export const EVENT_ERC20_TOKENS_COUNT = 'erc20/count'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(ERC20ManagerABI, at)
  }

  async _getTokens (addresses = []) {
    const [ tokensAddresses, names, symbols, urls, decimalsArr, ipfsHashes ] = await this._call('getTokens', [ addresses ])

    for (const [ i, name ] of Object.entries(names)) {
      names[ i ] = this._c.bytesToString(name)
      symbols[ i ] = this._c.bytesToString(symbols[ i ])
      urls[ i ] = this._c.bytesToString(urls[ i ])
      decimalsArr[ i ] = decimalsArr[ i ].toNumber()
      ipfsHashes[ i ] = this._c.bytes32ToIPFSHash(ipfsHashes[ i ])
    }

    return [ tokensAddresses, names, symbols, urls, decimalsArr, ipfsHashes ]
  }

  async fetchTokens (tokenAddresses = []) {
    const [ addresses, names, symbols, urls, decimalsArr, ipfsHashes ] = await this._call('getTokens', [ tokenAddresses ])
    this.emit(EVENT_ERC20_TOKENS_COUNT, addresses.length)

    addresses.forEach((address, i) => {
      const symbol = this._c.bytesToString(symbols[ i ])

      this.emit(EVENT_NEW_ERC20_TOKEN, new TokenModel({
        address,
        name: this._c.bytesToString(names[ i ]),
        symbol,
        url: this._c.bytesToString(urls[ i ]),
        decimals: decimalsArr[ i ].toNumber(),
        icon: this._c.bytes32ToIPFSHash(ipfsHashes[ i ]),
        isOptional: !MANDATORY_TOKENS.includes(symbol),
        isFetched: true,
        blockchain: 'Ethereum',
        isERC20: true,
      }))
    })
  }

  async getTokens (tokenAddresses: Array<String> = []): Immutable.Map<TokenModel> {
    let map = new Immutable.Map()

    const [ addresses, names, symbols, urls, decimalsArr, ipfsHashes ] = await this._getTokens(tokenAddresses)

    for (const [ i, address ] of Object.entries(addresses)) {
      const token = new TokenModel({
        address,
        name: names[ i ],
        symbol: symbols[ i ] ? symbols[ i ].toUpperCase() : address,
        url: urls[ i ],
        decimals: decimalsArr[ i ],
        icon: ipfsHashes[ i ],
        isOptional: !NON_OPTIONAL_TOKENS.includes(symbols[ i ]),
        isFetched: true,
        blockchain: 'Ethereum',
      })
      map = map.set(token.id(), token)
    }

    return map
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

  /**
   * For all users
   */
  addToken (token: TokenModel) {
    return this._tx(TX_ADD_TOKEN, this._setTokenParams(token), token)
  }

  /**
   * Only for CBE
   */
  modifyToken (oldToken: TokenModel, newToken: TokenModel) {
    return this._tx(TX_MODIFY_TOKEN, [ oldToken.address(), ...this._setTokenParams(newToken) ], newToken)
  }

  /**
   * Only for CBE
   */
  removeToken (token: TokenModel) {
    return this._tx(TX_REMOVE_TOKEN, [ token.address() ], token)
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
        blockchain: 'Ethereum',
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
