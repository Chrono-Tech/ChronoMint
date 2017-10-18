import BigNumber from 'bignumber.js'

import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TxModel from 'models/TxModel'

import { btcProvider, bccProvider } from 'network/BitcoinProvider'

import { bitcoinAddress } from 'components/forms/validator'

const EVENT_TX = 'tx'

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

  _createTxModel (tx, account): TxModel {
    const from = tx.isCoinBase ? 'coinbase' : tx.vin.map(input => input.addr).join(',')
    const to = tx.vout.map(output => output.scriptPubKey.addresses.join(',')).join(',')

    let value = new BigNumber(0)
    for (const output of tx.vout) {
      if (output.scriptPubKey.addresses.indexOf(account) < 0) {
        value = value.add(new BigNumber(output.value))
      }
    }

    const txmodel = new TxModel({
      txHash: tx.txid,
      blockHash: tx.blockhash,
      // blockNumber: tx.blockheight,
      blockNumber: null,
      from,
      to,
      value,
      fee: new BigNumber(tx.fees),
      credited: tx.isCoinBase || !tx.vin.filter(input => input.addr === account).length,
      symbol: this.getSymbol(),
    })
    return txmodel
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

  // eslint-disable-next-line no-unused-vars
  async watchTransfer (callback) {
    this._bitcoinProvider.addListener(EVENT_TX, async result => {
      const tx = await this._bitcoinProvider.getTransactionInfo(result.tx.txid)
      const account = this.getAccount()
      callback(new TransferNoticeModel({
        account,
        time: result.time / 1000,
        tx: this._createTxModel(tx, account),
      }))
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
