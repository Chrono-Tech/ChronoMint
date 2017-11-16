import BigNumber from 'bignumber.js'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TxModel from 'models/TxModel'
import AbstractTokenDAO, { TXS_PER_PAGE } from './AbstractTokenDAO'
import ERC20DAODefaultABI from './abi/ERC20DAODefaultABI'

export const TX_APPROVE = 'approve'
export const TX_TRANSFER = 'transfer'

const EVENT_TRANSFER = 'Transfer'
const EVENT_APPROVAL = 'Approval'

export default class ERC20DAO extends AbstractTokenDAO {
  constructor (at, json) {
    super(json || ERC20DAODefaultABI, at)
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
      throw new Error(`invalid decimals ${n}`)
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
    const amountBN = new BigNumber(amount)
    return amountBN.mul(Math.pow(10, this._decimals))
  }

  removeDecimals (amount: BigNumber): BigNumber {
    if (this._decimals === null) {
      throw new Error('removeDecimals: decimals is undefined')
    }
    const amountBN = new BigNumber(amount)
    return amountBN.div(Math.pow(10, this._decimals))
  }

  async initMetaData () {
    try {
      const [ symbol, decimals ] = await Promise.all([
        this._call('symbol'),
        this._callNum('decimals'),
      ])
      this.setSymbol(symbol)
      this.setDecimals(decimals)
    } catch (e) {
      // eslint-disable-next-line
      console.warn('initMetaData', e)
      // decimals & symbol may be absent in contract, so we simply go further
    }
  }

  async totalSupply (): BigNumber {
    const totalSupply = await this._call('totalSupply')
    return this.removeDecimals(totalSupply)
  }

  async getAccountBalance (account = this.getAccount()): BigNumber {
    return this.removeDecimals(await this._call('balanceOf', [ account ]))
  }

  async getAccountAllowance (spender, account = this.getAccount()): Promise<BigNumber> {
    return this.removeDecimals(await this._call('allowance', [ account, spender ]))
  }

  approve (account: string, amount: BigNumber) {
    console.log('--ERC20DAO#approve', account, amount)
    return this._tx(TX_APPROVE, [
      account,
      this.addDecimals(amount),
    ], {
      account,
      // amount,
      currency: this.getSymbol(),
    })
  }

  transfer (account, amount: BigNumber) {
    return this._tx(TX_TRANSFER, [
      account,
      this.addDecimals(amount),
    ], {
      account,
      amount,
      currency: this.getSymbol(),
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
      symbol: this.getSymbol(),
    })
  }

  /** @private */
  async _getTxModel (tx, account, block = null, time = null): Promise<?TxModel> {
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

  watchApproval (callback) {
    return this._watch(EVENT_APPROVAL, (result, block, time) => {
      callback(new ApprovalNoticeModel({
        value: this.removeDecimals(result.args.value),
        spender: result.args.spender,
        time,
      }))
    }, { from: this.getAccount() })
  }

  /** @inheritDoc */
  async watchTransfer (callback) {
    const account = this.getAccount()
    const internalCallback = async (result, block, time) => {
      const tx = await this._getTxModel(result, account, block, time / 1000)
      if (tx) {
        callback(new TransferNoticeModel({ tx, account, time }))
      }
    }
    await Promise.all([
      this._watch(EVENT_TRANSFER, internalCallback, { from: account }),
      this._watch(EVENT_TRANSFER, internalCallback, { to: account }),
    ])
  }

  async getTransfer (id, account = this.getAccount()): Promise<Array<TxModel>> {
    const result = await this._get(EVENT_TRANSFER, 0, 'latest', { from: account }, TXS_PER_PAGE, `${id}-in`)
    const result2 = await this._get(EVENT_TRANSFER, 0, 'latest', { to: account }, TXS_PER_PAGE, `${id}-out`)

    const callback = (tx) => promises.push(this._getTxModel(tx, account))
    const promises = []
    result.forEach(callback)
    result2.forEach(callback)

    return Promise.all(promises)
  }
}
