import BigNumber from 'bignumber.js'
import AbstractTokenDAO, { TXS_PER_PAGE } from './AbstractTokenDAO'

import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TxModel from 'models/TxModel'

export const TX_APPROVE = 'approve'
export const TX_TRANSFER = 'transfer'

export default class ERC20DAO extends AbstractTokenDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ERC20Interface.json'), at)
  }

  isInitialized () {
    return this._initialized
  }

  initialized () {
    this._initialized = true
  }

  setSymbol (symbol: string) {
    this._symbol = symbol
  }

  getSymbol () {
    if (!this._symbol) {
      throw new Error('symbol is undefined')
    }
    return this._symbol
  }

  setDecimals (n: number) {
    if (n < 0 || n > 20) {
      throw new Error('invalid decimals ' + n)
    }
    this._decimals = n
  }

  getDecimals () {
    return this._decimals
  }

  addDecimals (amount: BigNumber): BigNumber {
    if (this._decimals === null) {
      throw new Error('addDecimals: decimals is undefined')
    }
    return amount.mul(Math.pow(10, this._decimals))
  }

  removeDecimals (amount: BigNumber): BigNumber {
    if (this._decimals === null) {
      throw new Error('removeDecimals: decimals is undefined')
    }
    return amount.div(Math.pow(10, this._decimals))
  }

  async initMetaData () {
    try {
      const [symbol, decimals] = await Promise.all([
        this._call('symbol'),
        this._callNum('decimals')
      ])
      this.setSymbol(symbol)
      this.setDecimals(decimals)
    } catch (e) {
      // decimals & symbol may be absent in contract, so we simply go further
    }
  }

  totalSupply (): BigNumber {
    return this._call('totalSupply').then(r => this.removeDecimals(r))
  }

  getAccountBalance (block = 'latest', account = this.getAccount()): BigNumber {
    return this._call('balanceOf', [account], block).then(r => this.removeDecimals(r))
  }

  getPluralApprove (account, amount: BigNumber) {
    return {
      context: this, func: TX_APPROVE, args: [account, this.addDecimals(amount)],
      infoArgs: {account, amount, currency: this.getSymbol()}
    }
  }

  approve (account, amount: BigNumber) {
    return this._tx(TX_APPROVE, [account, this.addDecimals(amount)], {account, amount, currency: this.getSymbol()})
  }

  transfer (account, amount: BigNumber) {
    return this._tx(TX_TRANSFER, [account, this.addDecimals(amount)], {
      account,
      amount,
      currency: this.getSymbol()
    })
  }

  /** @private */
  _createTxModel (tx, account, block, time): TxModel {

    const gasPrice = new BigNumber(tx.gasPrice)
    const gasFee = this._c.fromWei(gasPrice.mul(tx.gas))

    return new TxModel({
      txHash: tx.transactionHash,
      blockHash: tx.blockHash,
      blockNumber: block,
      transactionIndex: tx.transactionIndex,
      from: tx.args.from,
      to: tx.args.to,
      value: this.removeDecimals(tx.args.value),
      gas: tx.gas,
      gasPrice,
      gasFee,
      time,
      credited: tx.args.to === account,
      symbol: this.getSymbol()
    })
  }

  /** @private */
  async _getTxModel (tx, account, block = null, time = null): ?TxModel {
    if (!tx.args.value) {
      return null
    }

    const txDetails = await this._web3Provider.getTransaction(tx.transactionHash)
    tx.gasPrice = txDetails.gasPrice
    tx.gas = txDetails.gas

    if (block && time) {
      return this._createTxModel(tx, account, block, time)
    }
    block = await this._web3Provider.getBlock(tx.blockHash)
    return this._createTxModel(tx, account, tx.blockNumber, block.timestamp)
  }

  /** @inheritDoc */
  async watchTransfer (callback) {
    const account = this.getAccount()
    const internalCallback = async (result, block, time) => {
      const tx = await this._getTxModel(result, account, block, time / 1000)
      if (tx) {
        callback(new TransferNoticeModel({tx, account, time}))
      }
    }
    await Promise.all([
      this._watch('Transfer', internalCallback, {from: account}),
      this._watch('Transfer', internalCallback, {to: account})
    ])
  }

  watchTransferPlain (callback) {
    return this._watch('Transfer', () => {
      callback()
    })
  }

  async getTransfer (id, account = this.getAccount()): Array<TxModel> {
    const result = await this._get('Transfer', 0, 'latest', {from: account}, TXS_PER_PAGE, id + '-in')
    const result2 = await this._get('Transfer', 0, 'latest', {to: account}, TXS_PER_PAGE, id + '-out')

    const callback = tx => promises.push(this._getTxModel(tx, account))
    const promises = []
    result.forEach(callback)
    result2.forEach(callback)

    return Promise.all(promises)
  }
}
