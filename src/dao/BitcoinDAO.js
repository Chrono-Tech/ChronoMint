import BigNumber from 'bignumber.js'
import bitcoinProvider from 'network/BitcoinProvider'
import TxModel from 'models/TxModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import { bitcoinAddress } from 'components/forms/validator'

const EVENT_TX = 'tx'

export class BitcoinDAO {

  static getName () {
    return 'Bitcoin'
  }

  static getSymbol () {
    return 'BTC'
  }

  getAddressValidator () {
    return bitcoinAddress
  }

  getAccount () {
    return bitcoinProvider.getAddress()
  }

  getName () {
    return BitcoinDAO.getName()
  }

  getSymbol () {
    return BitcoinDAO.getSymbol()
  }

  isApproveRequired () {
    return false
  }

  isInitialized () {
    return bitcoinProvider.isInitialized()
  }

  getDecimals () {
    return 8
  }

  _createTxModel (tx, account): TxModel {
    const from = tx.isCoinBase ? 'coinbase' : tx.vin.map((input) => input.addr).join(',')
    const to = tx.vout.map(
      (output) => output.scriptPubKey.addresses.join(',')
    ).join(',')

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
      credited: tx.isCoinBase || !tx.vin.filter((input) => input.addr === account).length,
      symbol: this.getSymbol()
    })
    return txmodel
  }

  async getAccountBalances () {
    const { balance0, balance6 } = await bitcoinProvider.getAccountBalances()
    return {
      balance: new BigNumber(balance0 || balance6),
      balance0: new BigNumber(balance0),
      balance6: new BigNumber(balance6)
    }
  }

  // eslint-disable-next-line no-unused-vars
  async transfer (to, amount: BigNumber) {
    return await bitcoinProvider.transfer(to, amount)
  }

  // eslint-disable-next-line no-unused-vars
  async getTransfer (id, account = this.getAccount()): Promise<Array<TxModel>> {
    // TODO @ipavlenko: Change the purpose of TxModel, add support of Bitcoin transactions
    return []
  }

  // eslint-disable-next-line no-unused-vars
  async watchTransfer (callback) {
    bitcoinProvider.addListener(EVENT_TX, async (result) => {
      const tx = await bitcoinProvider.getTransactionInfo(result.tx.txid)
      const account = this.getAccount()
      callback(
        new TransferNoticeModel({
          account,
          time: result.time / 1000,
          tx: this._createTxModel(tx, account)
        })
      )
    })
  }

  // eslint-disable-next-line no-unused-vars
  async watchApproval (callback) {
    // Ignore
  }
}

export default new BitcoinDAO()
