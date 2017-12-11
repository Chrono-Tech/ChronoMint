import TokensCollection from 'models/exchange/TokensCollection'
import TokenManagementExtensionDAO from 'dao/TokenManagementExtensionDAO'
import Immutable from 'immutable'
import TokenNoticeModel from 'models/notices/TokenNoticeModel'
import TokenModel from 'models/tokens/TokenModel'
import { ERC20ManagerABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'
import { bccDAO, btcDAO } from './BitcoinDAO'
import contractsManagerDAO from './ContractsManagerDAO'
import ERC20DAO from './ERC20DAO'
import ethereumDAO, { EthereumDAO } from './EthereumDAO'
import lhtDAO from './LHTDAO'
import { TIME } from './TIMEHolderDAO'

export const TX_ADD_TOKEN = 'addToken'
export const TX_MODIFY_TOKEN = 'setToken'
export const TX_REMOVE_TOKEN = 'removeToken'

const MANDATORY_TOKENS = ['TIME']

export const EVENT_NEW_ERC20_TOKEN = 'erc20/newToken'
export const EVENT_ERC20_TOKENS_COUNT = 'erc20/count'

export default class ERC20ManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(ERC20ManagerABI, at)
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

    for (const [i, name] of Object.entries(names)) {
      names[i] = this._c.bytesToString(name)
      symbols[i] = this._c.bytesToString(symbols[i])
      urls[i] = this._c.bytesToString(urls[i])
      decimalsArr[i] = decimalsArr[i].toNumber()
      ipfsHashes[i] = this._c.bytes32ToIPFSHash(ipfsHashes[i])
    }

    return [tokensAddresses, names, symbols, urls, decimalsArr, ipfsHashes]
  }

  async fetchTokens (tokenAddresses = []) {
    const [addresses, names, symbols, urls, decimalsArr, ipfsHashes] = await this._call('getTokens', [tokenAddresses])
    this.emit(EVENT_ERC20_TOKENS_COUNT, addresses.length)

    addresses.forEach((address, i) => {
      const symbol = this._c.bytesToString(symbols[i])

      this.emit(EVENT_NEW_ERC20_TOKEN, new TokenModel({
        address,
        name: this._c.bytesToString(names[i]),
        symbol,
        url: this._c.bytesToString(urls[i]),
        decimals: decimalsArr[i].toNumber(),
        icon: this._c.bytes32ToIPFSHash(ipfsHashes[i]),
        isOptional: !MANDATORY_TOKENS.includes(symbol),
        isFetched: true,
        blockchain: 'Ethereum',
        isERC20: true,
      }))
    })
  }

  /**
   * ETH, TIME will be added by flag isWithObligatory
   */
  async getTokensByAddresses (addresses: Array = [], isWithObligatory = true, account = this.getAccount(), additionalData = {}): Immutable.Map<TokenModel> {
    let promises
    const timeDAO = await contractsManagerDAO.getTIMEDAO()
    if (isWithObligatory) {
      // add TIME address to filters
      addresses.push(timeDAO.getInitAddress())
    }
    // get data
    const [tokensAddresses, names, symbols, urls, decimalsArr, ipfsHashes] = await this._getTokens(addresses)

    // init DAOs
    promises = []
    for (const address of tokensAddresses) {
      promises.push(contractsManagerDAO.getERC20DAO(address, false, true))
    }
    const daos = await Promise.all(promises)

    for (let [i, address] of Object.entries(tokensAddresses)) {
      this.initTokenMetaData(daos[i], symbols[i], decimalsArr[i])
    }

    // get balances
    promises = []
    for (const i of Object.keys(tokensAddresses)) {
      this.initTokenMetaData(daos[i], symbols[i], decimalsArr[i])
      promises.push(daos[i].getAccountBalance(account))
    }
    const balances = await Promise.all(promises)
    // prepare result
    let map = new Immutable.Map()

    if (isWithObligatory) {
      // add ETH to result map
      const ethToken = new TokenModel({
        dao: ethereumDAO,
        name: EthereumDAO.getName(),
        balance: await ethereumDAO.getAccountBalance(account),
        isOptional: false,
        isFetched: true,
        blockchain: 'Ethereum',
      })
      map = map.set(ethToken.id(), ethToken)

      if (btcDAO.isInitialized()) {
        try {
          const { balance, balance0, balance6 } = await btcDAO.getAccountBalances()
          const btcToken = new TokenModel({
            dao: btcDAO,
            name: btcDAO.getName(),
            symbol: btcDAO.getSymbol(),
            isApproveRequired: false,
            balance,
            balance0,
            balance6,
            isOptional: false,
            isFetched: true,
            blockchain: 'Bitcoin',
          })
          map = map.set(btcToken.id(), btcToken)
        } catch (e) {
          // eslint-disable-next-line
          console.log('BTC support is not available', e)
        }
      }

      if (bccDAO.isInitialized()) {
        try {
          const { balance, balance0, balance6 } = await bccDAO.getAccountBalances()
          const bccToken = new TokenModel({
            dao: bccDAO,
            name: bccDAO.getName(),
            symbol: bccDAO.getSymbol(),
            isApproveRequired: false,
            balance,
            balance0,
            balance6,
            isOptional: false,
            isFetched: true,
            blockchain: 'Bitcoin Cash',
          })
          map = map.set(bccToken.id(), bccToken)
        } catch (e) {
          // eslint-disable-next-line
          console.log('BCC support is not available', e)
        }
      }
    }
    const timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
    const timeHolderAddress = timeHolderDAO.getInitAddress()

    for (const [i, address] of Object.entries(tokensAddresses)) {
      let token = new TokenModel({
        address,
        dao: daos[i],
        name: names[i],
        symbol: symbols[i],
        url: urls[i],
        decimals: decimalsArr[i],
        icon: ipfsHashes[i],
        balance: balances[i],
        platform: additionalData[address] && additionalData[address].platform,
        totalSupply: additionalData[address] && TokenManagementExtensionDAO.removeDecimals(additionalData[address].totalSupply, decimalsArr[i]),
        isOptional: MANDATORY_TOKENS.includes(symbols[i]),
        isFetched: true,
        blockchain: 'Ethereum',
      })

      if (token.symbol() === TIME) {
        const timeHolderWalletAddress = await timeHolderDAO.getWalletAddress()

        const [timeHolderAllowance, timeHolderWalletAllowance] = await Promise.all([
          timeDAO.getAccountAllowance(timeHolderAddress),
          timeDAO.getAccountAllowance(timeHolderWalletAddress),
        ])

        token = token
          .setAllowance(timeHolderAddress, timeHolderAllowance)
          .setAllowance(timeHolderWalletAddress, timeHolderWalletAllowance)
      }

      map = map.set(token.id(), token)
    }

    return map
  }

  /**
   * With ETH, TIME (because they are obligatory) and balances for each token.
   */
  getUserTokens (addresses: Array = []) {
    return this.getTokensByAddresses(addresses, true)
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
    return this._tx(TX_MODIFY_TOKEN, [oldToken.address(), ...this._setTokenParams(newToken)], newToken)
  }

  /**
   * Only for CBE
   */
  removeToken (token: TokenModel) {
    return this._tx(TX_REMOVE_TOKEN, [token.address()], token)
  }

  /**
   * Only for LOC
   */
  async getLOCTokens () {
    // TODO @dkchv: for now LHT only
    const lhtAddress = await lhtDAO.getAddress()
    return this.getTokensByAddresses([lhtAddress], false)
  }

  /** @private */
  _watchCallback = (callback, isRemoved = false, isAdded = true) => async (result, block, time) => {
    callback(new TokenNoticeModel(
      new TokenModel({
        address: result.args.token,
        name: this._c.bytesToString(result.args.name),
        symbol: this._c.bytesToString(result.args.symbol),
        url: this._c.bytesToString(result.args.url),
        decimals: result.args.decimals.toNumber(),
        icon: this._c.bytes32ToIPFSHash(result.args.ipfsHash),
        blockchain: 'Ethereum',
      }),
      time, isRemoved, isAdded, result.args.oldToken || null
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

  async getTokensList () {
    const addresses = await this._call('getTokenAddresses')
    const tokens = await this.getTokensByAddresses(addresses, false)
    return new TokensCollection({ list: tokens })
  }
}
