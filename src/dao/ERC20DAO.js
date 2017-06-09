import Immutable from 'immutable'
import AbstractTokenDAO from './AbstractTokenDAO'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'
import TransactionModel from '../models/TransactionModel'
import LS from '../utils/LocalStorage'

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

  setName (name: string) {
    this._name = name
  }

  getName () {
    if (!this._name) {
      return this.getSymbol().toUpperCase()
    }
    return this._name
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

  addDecimals (amount: number) {
    if (this._decimals === null) {
      throw new Error('addDecimals: decimals is undefined')
    }
    return amount * Math.pow(10, this._decimals)
  }

  removeDecimals (amount: number) {
    if (this._decimals === null) {
      throw new Error('removeDecimals: decimals is undefined')
    }
    return amount / Math.pow(10, this._decimals)
  }

  async initMetaData () {
    try {
      const [symbol, decimals] = await Promise.all([
        this._call('symbol'),
        this._callNum('decimals')
      ])
      dao.setSymbol(symbol)
      dao.setDecimals(decimals)
    } catch (e) {
      // decimals & symbol may be absent in contract, so we simply go further
    }
  }

  totalSupply () {
    return this._callNum('totalSupply').then(r => this.removeDecimals(r))
  }

  getAccountBalance (account: string) {
    return this._callNum('balanceOf', [account]).then(r => this.removeDecimals(r))
  }

  approve (account: string, amount: number) {
    return this._tx(TX_APPROVE, [account, this.addDecimals(amount)], {account, amount})
  }

  transfer (amount, recipient) {
    return this._tx(TX_TRANSFER, [recipient, this.addDecimals(amount)], {recipient, amount})
  }

  /**
   * @param tx object
   * @param account
   * @param block
   * @param time
   * @returns {TransactionModel|null}
   * @private
   */
  _getTxModel (tx, account, block = null, time = null) {
    return new Promise(resolve => {
      const callback = (block, time) => {
        return new TransactionModel({
          txHash: tx.transactionHash,
          blockHash: tx.blockHash,
          blockNumber: block,
          transactionIndex: tx.transactionIndex,
          from: tx.args.from,
          to: tx.args.to,
          value: this.removeDecimals(tx.args.value.toNumber()),
          time,
          credited: tx.args.to === account,
          symbol: this.getSymbol()
        })
      }
      if ((tx.args.to === account || tx.args.from === account) && tx.args.value > 0) {
        if (block && time) {
          return resolve(callback(block, time))
        }
        this.web3.eth.getBlock(tx.blockHash, (e, block) => {
          if (e) {
            resolve(null)
          } else {
            return resolve(callback(tx.blockNumber, block.timestamp))
          }
        })
      } else {
        resolve(null)
      }
    })
  }

  /** @inheritDoc */
  watchTransfer (callback) {
    const account = LS.getAccount()
    return this._watch('Transfer', (result, block, time, isOld) => {
      this._getTxModel(result, account, block, time / 1000).then(tx => {
        if (tx) {
          callback(new TransferNoticeModel({tx, account, time}), isOld)
        }
      })
    }, this.getSymbol())
  }

  watchTransferPlain (callback) {
    return this._watch('Transfer', () => {
      callback()
    }, false)
  }

  /**
   * @param account
   * @param fromBlock
   * @param toBlock
   * @returns {Promise.<Map.<TransactionModel>>}
   */
  async getTransfer (account, fromBlock, toBlock): Promise<Immutable.Map<string,TransactionModel>> {
    let map = new Immutable.Map()
    const r = await this._get('Transfer', fromBlock, toBlock)

    const promises = []
    r.forEach(tx => promises.push(this._getTxModel(tx, account, this.getSymbol())))

    const values = await Promise.all(promises)
    values.forEach(model => {
      if (model) {
        map = map.set(model.id(), model)
      }
    })

    return map
  }
}
