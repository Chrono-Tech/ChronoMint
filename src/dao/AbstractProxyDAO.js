/* eslint new-cap: ["error", { "capIsNewExceptions": ["Transfer"] }] */
import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import ChronoMintDAO from './ChronoMintDAO'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'
import TransactionModel from '../models/TransactionModel'

class AbstractProxyDAO extends AbstractContractDAO {
  constructor (json, at = null) {
    super(json, at)
    if (new.target === AbstractProxyDAO) {
      throw new TypeError('Cannot construct AbstractProxyDAO instance directly')
    }
  }

  getLatestVersion () {
    return this.contract.then(deployed => deployed.getLatestVersion.call())
  }

  getName () {
    return this.contract.then(deployed => deployed.name.call())
  }

  getSymbol () {
    return this.contract.then(deployed => deployed.symbol.call())
  }

  totalSupply () {
    return this.contract.then(deployed => deployed.totalSupply.call().then(supply => {
      return supply.toNumber()
    }))
  }

  getAccountBalance (account) {
    return this.contract.then(deployed => deployed.balanceOf.call(account).then(r => r.toNumber() / 100))
  }

  approve (address, amount, account) {
    return this.contract.then(deployed => deployed.approve(address, amount, {from: account, gas: 3000000}))
  }

  proposeUpgrade () {
    return ChronoMintDAO.getAddress().then(address => {
      this.contract.then(deployed => deployed.proposeUpgrade(this.time.address, {from: address}))
    })
  }

  transfer (amount, recipient, sender) {
    return this.contract.then(deployed => deployed.transfer(recipient, amount * 100, {from: sender, gas: 3000000}))
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
   * @param account
   */
  watchTransfer (callback, account) {
    return this.contract.then(deployed => {
      return this.getSymbol().then(symbol => {
        return this._watch(deployed.Transfer, (result, block, time, isOld) => {
          this._getAccountTxModel(result, account, symbol, block, time / 1000).then(tx => {
            if (tx) {
              callback(new TransferNoticeModel({tx, account, time}), isOld)
            }
          })
        }, 'tokenTransfer' + symbol)
      })
    })
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
          deployed.Transfer({}, {fromBlock, toBlock}).get((e, r) => {
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

export default AbstractProxyDAO
