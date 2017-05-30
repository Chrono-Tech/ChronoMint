import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'
import TransactionModel from '../models/TransactionModel'
import LS from '../utils/LocalStorage'

export const TX_APPROVE = 'approve'
export const TX_TRANSFER = 'transfer'

export default class ERC20DAO extends AbstractContractDAO {
  constructor (at = null, json = null) {
    super(json || require('chronobank-smart-contracts/build/contracts/ERC20Interface.json'), at)
  }

  isInitialized () {
    return this._initialized
  }

  initialized () {
    this._initialized = true
  }

  // noinspection JSUnusedGlobalSymbols TODO use setDecimals
  setDecimals (n: number) {
    if (n < 1 || n > 20) {
      throw new Error('invalid decimals ' + n)
    }
    this._decimals = Math.pow(10, n)
  }

  addDecimals (amount: number) {
    if (!this._decimals) {
      throw new Error('addDecimals: decimals is undefined')
    }
    return amount * this._decimals
  }

  removeDecimals (amount: number) {
    if (!this._decimals) {
      throw new Error('removeDecimals: decimals is undefined')
    }
    return amount / this._decimals
  }

  // TODO symbol is available not in all ERC20 tokens
  getSymbol () {
    return this._call('symbol')
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
   * @param symbol
   * @param block
   * @param time
   * @returns {TransactionModel|null}
   * @private
   */
  _getAccountTxModel (tx, account, symbol, block = null, time = null) {
    return new Promise(resolve => {
      const callback = (block, time) => {
        return new TransactionModel({
          txHash: tx.transactionHash,
          blockHash: tx.blockHash,
          blockNumber: block,
          transactionIndex: tx.transactionIndex,
          from: tx.args.from,
          to: tx.args.to,
          value: tx.args.value.toNumber(),
          time,
          credited: tx.args.to === account,
          symbol
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

  /**
   * @param callback will receive TransferNoticeModel and isOld flag
   * @see TransferNoticeModel with...
   * @see TransactionModel
   */
  watchTransfer (callback) {
    const account = LS.getAccount()
    return this.getSymbol().then(symbol => {
      return this.watch('Transfer', (result, block, time, isOld) => {
        this._getAccountTxModel(result, account, symbol, block, time / 1000).then(tx => {
          if (tx) {
            callback(new TransferNoticeModel({tx, account, time}), isOld)
          }
        })
      }, symbol)
    })
  }

  watchTransferPlain (callback) {
    return this.watch('Transfer', () => {
      callback()
    }, false)
  }

  /**
   * @param account
   * @param fromBlock
   * @param toBlock
   * @returns {Promise.<Map.<TransactionModel>>}
   */
  getTransfer (account, fromBlock: number, toBlock: number) {
    let map = new Map()
    return new Promise(resolve => {
      this.contract.then(deployed => {
        this.getSymbol().then(symbol => {
          deployed['Transfer']({}, {fromBlock, toBlock}).get((e, r) => {
            if (e || !r.length) {
              return resolve(map)
            }
            const promises = []
            r.forEach(tx => promises.push(this._getAccountTxModel(tx, account, symbol)))
            Promise.all(promises).then(values => {
              values.forEach(model => {
                if (model) {
                  map = map.set(model.id(), model)
                }
              })
              resolve(map)
            })
          })
        })
      })
    })
  }
}
