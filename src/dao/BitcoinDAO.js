import BigNumber from 'bignumber.js'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import type TxModel from 'models/TxModel'
import { btcProvider, bccProvider } from 'Login/network/BitcoinProvider'
import { DECIMALS } from 'Login/network/BitcoinEngine'
import { bitcoinAddress } from 'components/forms/validator'

const EVENT_TX = 'tx'
const EVENT_BALANCE = 'balance'

export class BitcoinDAO {
  constructor (name, symbol, bitcoinProvider) {
    this._name = name
    this._symbol = symbol
    this._bitcoinProvider = bitcoinProvider
  }

  getAddressValidator () {
    return bitcoinAddress
  }

  getAccount () {
    return this._bitcoinProvider.getAddress()
  }

  /**
   * TODO Hacked implementation normal work logic is not guarantied
   * TODO Needed for call compatibility with @see AbstractContractDAO
   */
  getInitAddress () {
    return this._bitcoinProvider.getAddress()
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
}

export const btcDAO = new BitcoinDAO('Bitcoin', 'BTC', btcProvider)
export const bccDAO = new BitcoinDAO('Bitcoin Cash', 'BCC', bccProvider)
