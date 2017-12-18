import BigNumber from 'bignumber.js'
import Amount from 'models/Amount'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TokenModel from 'models/tokens/TokenModel'
import TxModel from 'models/TxModel'
import ERC20DAODefaultABI from './abi/ERC20DAODefaultABI'
import AbstractTokenDAO, { TXS_PER_PAGE } from './AbstractTokenDAO'

export const TX_TRANSFER = 'transfer'

const EVENT_TRANSFER = 'Transfer'
const EVENT_APPROVAL = 'Approval'

export default class ERC20DAO extends AbstractTokenDAO {
  constructor (token: TokenModel, abi) {
    super(abi || ERC20DAODefaultABI, token.address())
    // TODO @dkchv: throw if > 20 !!!
    if (token.decimals() > 20) {
      throw new Error(`decimals for token ${token.id()} must be lower than 20`)
    }
    this._decimals = token.decimals()
    this._symbol = token.symbol()
  }

  /**
   * Will be removed after SC refactoring with addresses
   * @deprecated
   */
  getSymbol () {
    return this._symbol
  }

  getDecimals () {
    return this._decimals
  }

  // addDecimals (amount: Amount): Amount {
  //   return amount.mul(Math.pow(10, this._decimals))
  // }
  //
  // removeDecimals (amount: Amount): Amount {
  //   return amount.div(Math.pow(10, this._decimals))
  // }

  addDecimals (amount: BigNumber): BigNumber {
    if (this._decimals === null) {
      throw new Error('addDecimals: decimals is undefined')
    }
    const amountBN = new BigNumber(amount)
    return amountBN.mul(Math.pow(10, this._decimals))
  }

  removeDecimals (amount: BigNumber): BigNumber {
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
    return await this._call('totalSupply')
  }

  async getAccountBalance (account = this.getAccount()): BigNumber {
    return await this._call('balanceOf', [ account ])
  }

  async getAccountAllowance (spender, account = this.getAccount()): Promise<BigNumber> {
    return await this._call('allowance', [ account, spender ])
  }

  approve (account: string, amount: Amount) {
    return this._tx('approve', [
      account,
      this.addDecimals(amount),
    ], {
      account,
      amount,
      currency: amount.symbol(),
    })
  }

  transfer (recipient, amount: Amount) {
    return this._tx(TX_TRANSFER, [
      recipient,
      this.addDecimals(amount),
    ], {
      recipient,
      amount,
      currency: amount.symbol(),
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
      value: new Amount(this.removeDecimals(tx.args.value), this.getInitAddress()),
      gas: tx.gas,
      gasPrice,
      gasFee,
      time,
      token: this.getInitAddress(),
      credited: tx.args.to === account,
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
    const minedBlock = await this._web3Provider.getBlock(tx.blockHash)
    return this._createTxModel(tx, account, tx.blockNumber, minedBlock.timestamp)
  }

  watchApproval (from, callback) {
    return this._watch(EVENT_APPROVAL, (result, block, time) => {
      callback(new ApprovalNoticeModel({
        value: this.removeDecimals(result.args.value),
        spender: result.args.spender,
        time,
      }))
    }, { from })
  }

  /** @inheritDoc */
  async watchTransfer (account, callback) {
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
