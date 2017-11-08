import BigNumber from 'bignumber.js'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TxModel from 'models/TxModel'
import AbstractTokenDAO, { TXS_PER_PAGE } from './AbstractTokenDAO'

export const TX_APPROVE = 'approve'
export const TX_TRANSFER = 'transfer'

const EVENT_TRANSFER = 'Transfer'
const EVENT_APPROVAL = 'Approval'

export default class ERC20DAO extends AbstractTokenDAO {
  constructor (at, json) {
    super(json || defaultJSON, at)
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
    amount = new BigNumber(amount.toString(10))
    return amount.mul(Math.pow(10, this._decimals))
  }

  removeDecimals (amount: BigNumber): BigNumber {
    console.log(this._symbol)
    if (this._decimals === null) {
      throw new Error('removeDecimals: decimals is undefined')
    }
    amount = new BigNumber(amount.toString(10))
    return amount.div(Math.pow(10, this._decimals))
  }

  async initMetaData () {
    try {
      const [symbol, decimals] = await Promise.all([
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

  totalSupply (): BigNumber {
    return this._call('totalSupply').then((r) => this.removeDecimals(r))
  }

  async getAccountBalance (account = this.getAccount(), block = 'latest'): Promise<BigNumber> {
    return this.removeDecimals(await this._call('balanceOf', [account], block))
  }

  async getAccountAllowance (spender, account = this.getAccount()): Promise<BigNumber> {
    return this.removeDecimals(await this._call('allowance', [account, spender]))
  }

  approve (account, amount: BigNumber) {
    return this._tx(TX_APPROVE, [account, this.addDecimals(amount)], { account, amount, currency: this.getSymbol() })
  }

  transfer (account, amount: BigNumber) {
    return this._tx(TX_TRANSFER, [account, this.addDecimals(amount)], {
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

  async watchApproval (callback) {
    this._watch(EVENT_APPROVAL, (result, block, time) => {
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

const defaultJSON = {
  contract_name: 'ERC20Interface',
  abi: [
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          name: 'success',
          type: 'bool',
        },
      ],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          name: 'supply',
          type: 'uint256',
        },
      ],
      payable: false,
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          name: 'success',
          type: 'bool',
        },
      ],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256',
        },
      ],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          name: 'success',
          type: 'bool',
        },
      ],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
        {
          name: '_spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          name: 'remaining',
          type: 'uint256',
        },
      ],
      payable: false,
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
  ],
  unlinked_binary: '0x',
  networks: {},
  schema_version: '0.0.5',
  updated_at: 1500881309403,
}
