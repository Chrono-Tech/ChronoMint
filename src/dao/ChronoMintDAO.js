import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import LS from '../utils/LocalStorage'
import TransactionModel from '../models/TransactionModel'
import TransactionExecModel from '../models/TransactionExecModel'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'
import web3Provider from '../network/Web3Provider'

class ChronoMintDAO extends AbstractContractDAO {
  getAccountETHBalance (account) {
    return web3Provider.getBalance(account).then(balance => {
      return this._c.fromWei(balance.toNumber())
    })
  }

  /**
   * @param tx
   * @param account
   * @param time
   * @returns {TransactionModel}
   * @private
   */
  _getTxModel (tx, account, time = Date.now() / 1000) {
    return new TransactionModel({
      txHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.from,
      to: tx.to,
      value: tx.value.toNumber(),
      time,
      gasPrice: tx.gasPrice,
      gas: tx.gas,
      input: tx.input,
      credited: tx.to === account,
      symbol: 'ETH'
    })
  }

  /**
   * @param to
   * @param amount
   * @returns {Promise.<TransferNoticeModel>}
   */
  sendETH (to: string, amount: string) {
    const tx = new TransactionExecModel({
      contract: 'Ethereum',
      func: 'sendETH',
      value: amount
    })
    AbstractContractDAO.txStart(tx)
    return new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction({
        from: LS.getAccount(),
        to,
        value: this._c.toWei(parseFloat(amount, 10))
      }, (e, txHash) => {
        if (e) {
          AbstractContractDAO.txEnd(tx.id(), e)
          return reject(e)
        }
        if (!e) {
          let finish = false
          const filter = this.web3.eth.filter('latest', (e, blockHash) => {
            if (!e && !finish) {
              this.web3.eth.getBlock(blockHash, (e, block) => {
                if (!e && block.transactions.includes(txHash)) {
                  this.web3.eth.getTransaction(txHash, (e, txData) => {
                    if (!e) {
                      resolve(new TransferNoticeModel({
                        tx: this._getTxModel(txData, LS.getAccount()),
                        account: LS.getAccount()
                      }))
                      finish = true
                      filter.stopWatching(() => {})
                    }
                  })
                }
              })
            }
          })
        }
      })
    })
  }

  getAccountETHTxs (account, fromBlock, toBlock) {
    const callback = (block) => {
      return new Promise(resolve => {
        this.web3.eth.getBlock(block, true, (e, r) => {
          let map = new Map()
          if (!e && r.transactions) {
            for (let i = 0; i < r.transactions.length; i++) {
              const tx = r.transactions[i]
              if ((tx.to === account || tx.from === account) && tx.value > 0) {
                const txModel: TransactionModel = this._getTxModel(tx, account, r.timestamp)
                map = map.set(txModel.id(), txModel)
              }
            }
          }
          resolve(map)
        })
      })
    }
    const promises = []
    let map = new Map()
    for (let i = fromBlock; i <= toBlock; i++) {
      promises.push(callback(i))
    }
    return new Promise(resolve => {
      Promise.all(promises).then(values => {
        values.forEach(txs => {
          map = map.merge(txs)
        })
        resolve(map)
      })
    })
  }
}

export default new ChronoMintDAO(require('chronobank-smart-contracts/build/contracts/ChronoMint.json'))
