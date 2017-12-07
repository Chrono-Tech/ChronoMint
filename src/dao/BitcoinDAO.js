import BigNumber from 'bignumber.js'
import { bitcoinAddress } from 'components/forms/validator'
import EventEmitter from 'events'
import { DECIMALS } from 'Login/network/BitcoinEngine'
import { bccProvider, btcProvider } from 'Login/network/BitcoinProvider'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TokenModel from 'models/TokenModel'
import type TxModel from 'models/TxModel'

const EVENT_TX = 'tx'
const EVENT_BALANCE = 'balance'

export class BitcoinDAO extends EventEmitter {
  constructor (name, symbol, bitcoinProvider) {
    super()
    this._name = name
    this._symbol = symbol
    this._bitcoinProvider = bitcoinProvider
    this._bitcoinProvider.addListener('subscribe', () => this.onSubscribe())
  }

  getAddressValidator () {
    return bitcoinAddress
  }

  getAccount () {
    return this._bitcoinProvider.getAddress()
  }

  getInitAddress () {
    // BitcoinDAO is not a cntract DAO, bitcoin have no initial address, but it have a token name.
    return `Bitcoin/${this._symbol}`
  }

  getName () {
    return this._name
  }

  getSymbol () {
    return this._symbol
  }

  isApproveRequired () {
    return false
  }

  isInitialized () {
    return this._bitcoinProvider.isInitialized()
  }

  getDecimals () {
    return 8
  }

  async getAccountBalances () {
    const { balance0, balance6 } = await this._bitcoinProvider.getAccountBalances()
    return {
      balance: new BigNumber(balance0 || balance6),
      balance0: new BigNumber(balance0),
      balance6: new BigNumber(balance6),
    }
  }

  // eslint-disable-next-line no-unused-vars
  async transfer (to, amount: BigNumber) {
    return await this._bitcoinProvider.transfer(to, amount)
  }

  // eslint-disable-next-line no-unused-vars
  async getTransfer (id, account = this.getAccount()): Promise<Array<TxModel>> {
    // TODO @ipavlenko: Change the purpose of TxModel, add support of Bitcoin transactions
    return []
  }

  async watchTransfer (callback) {
    this._bitcoinProvider.addListener(EVENT_TX, async ({ account, time, tx }) => {
      callback(new TransferNoticeModel({
        account,
        time,
        tx: tx.set('symbol', this.getSymbol()),
      }))
    })
  }

  async watchBalance (callback) {
    this._bitcoinProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      callback({
        account,
        time,
        balance: (new BigNumber(balance.balance0)).div(DECIMALS),
        symbol: this.getSymbol(),
      })
    })
  }

  // eslint-disable-next-line no-unused-vars
  async watchApproval (callback) {
    // Ignore
  }

  async stopWatching () {
    // Ignore
  }

  resetFilterCache () {
    // do nothing
  }

  getToken () {
    if (!this.isInitialized()) {
      console.warn(`${this._symbol} not initialized`)
      return
    }
    return new TokenModel({
      address: this.getAccount(),
      name: this._name,
      symbol: this._symbol,
      isApproveRequired: false,
      isOptional: false,
      isFetched: true,
      blockchain: 'Bitcoin',
    })
  }
}

export const btcDAO = new BitcoinDAO('Bitcoin', 'BTC', btcProvider)
export const bccDAO = new BitcoinDAO('Bitcoin Cash', 'BCC', bccProvider)
