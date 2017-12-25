import BigNumber from 'bignumber.js'
import Amount from 'models/Amount'
import TokenModel from 'models/tokens/TokenModel'
import TxModel from 'models/TxModel'
import ERC20DAODefaultABI from './abi/ERC20DAODefaultABI'
import AbstractTokenDAO, { EVENT_APPROVAL_TRANSFER, EVENT_NEW_TRANSFER, TXS_PER_PAGE } from './AbstractTokenDAO'

export const TX_TRANSFER = 'transfer'
export const TX_APPROVE = 'approve'

const EVENT_TRANSFER = 'Transfer'
const EVENT_APPROVAL = 'Approval'

export default class ERC20DAO extends AbstractTokenDAO {
  constructor (token: TokenModel, abi) {
    super(abi || ERC20DAODefaultABI, token.address())
    if (token.decimals() > 20) {
      throw new Error(`decimals for token ${token.id()} must be lower than 20`)
    }
    this._decimals = token.decimals()
    this._symbol = token.symbol()
  }

  /**
   * @deprecated
   */
  getSymbol () {
    return this._symbol
  }

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

  totalSupply (): Promise {
    return this._call('totalSupply')
  }

  getAccountBalance (account): Promise {
    return this._call('balanceOf', [ account ])
  }

  getAccountAllowance (account, spender): Promise {
    return this._call('allowance', [ account, spender ])
  }

  approve (account: string, amount: Amount): Promise {
    return this._tx('approve', [
      account,
      new BigNumber(amount),
    ], {
      account,
      amount,
      currency: amount.symbol(),
    })
  }

  transfer (from: string, to: string, amount: Amount, token: TokenModel, feeMultiplier): Promise {
    return this._tx(TX_TRANSFER, [
      to,
      new BigNumber(amount),
    ], {
      from,
      to,
      amount,
      currency: amount.symbol(),
    })
  }

  /** @private */
  _createTxModel (tx, account, block, time): TxModel {
    const gasPrice = new BigNumber(tx.gasPrice)
    const gasFee = gasPrice.mul(tx.gas)

    return new TxModel({
      txHash: tx.transactionHash,
      blockHash: tx.blockHash,
      blockNumber: block,
      transactionIndex: tx.transactionIndex,
      from: tx.args.from,
      to: tx.args.to,
      value: new Amount(tx.args.value, this._symbol),
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

  watch (account): Promise {
    return Promise.all([
      this.watchTransfer(account),
      this.watchApproval(account),
    ])
  }

  watchApproval (account) {
    return this._watch(EVENT_APPROVAL, (result) => {
      this.emit(EVENT_APPROVAL_TRANSFER, result.args)
    }, { from: account })
  }

  async watchTransfer (account) {
    const internalCallback = async (result, block, time) => {
      const tx = await this._getTxModel(result, account, block, time / 1000)
      if (tx) {
        this.emit(EVENT_NEW_TRANSFER, tx)
      }
    }
    await Promise.all([
      this._watch(EVENT_TRANSFER, internalCallback, { from: account }),
      this._watch(EVENT_TRANSFER, internalCallback, { to: account }),
    ])
  }

  async getTransfer (id, account): Promise<Array<TxModel>> {
    const result = await this._get(EVENT_TRANSFER, 0, 'latest', { from: account }, TXS_PER_PAGE, `${id}-in`)
    const result2 = await this._get(EVENT_TRANSFER, 0, 'latest', { to: account }, TXS_PER_PAGE, `${id}-out`)

    const callback = (tx) => promises.push(this._getTxModel(tx, account))
    const promises = []
    result.forEach(callback)
    result2.forEach(callback)

    return Promise.all(promises)
  }
}
