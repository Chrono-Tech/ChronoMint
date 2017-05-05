import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import LS from './LocalStorageDAO'
import TransactionModel from '../models/TransactionModel'
import PendingTransactionModel from '../models/PendingTransactionModel'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'
import web3Provider from '../network/Web3Provider'

class ChronoMintDAO extends AbstractContractDAO {
  getAccountETHBalance (account) {
    return web3Provider.getBalance(account).then(balance => {
      return this.converter.fromWei(balance.toNumber())
    })
  }

  /**
   * @param tx
   * @param account
   * @param time
   * @returns {TransactionModel}
   * @private
   */
  _getTxModel (tx, account, time = Date.now()) {
    return new TransactionModel({
      txHash: tx.hash,
      nonce: tx.nonce,
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
    const tx = new PendingTransactionModel({
      contract: 'Ethereum',
      func: 'sendETH',
      value: amount
    })
    AbstractContractDAO.txStart(tx)
    return new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction({
        from: LS.getAccount(),
        to,
        value: this.converter.toWei(parseFloat(amount, 10))
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

  // TODO @dkchv: for merge
  // sendETH (to: string, amount: string) {
  //   const account = LS.getAccount()
  //   const transaction = {
  //     from: account,
  //     to,
  //     value: this.converter.toWei(parseFloat(amount, 10))
  //   }
  //
  //   return web3Provider.sendTransaction(transaction).then(sendedTxHash => {
  //     return web3Provider.getBlock('pending').then(pendingBlock => {
  //       const filteredTx = pendingBlock.transactions.filter(tx => sendedTxHash === tx)
  //       if (!filteredTx) {
  //         // TODO @dkchv: and what? its not an error, we should find in mined blocks
  //         throw new Error('tx not found in pending block')
  //       }
  //
  //       return web3Provider.getTransaction(sendedTxHash).then(txHash => {
  //         const noticeModel = {
  //           tx: this._getTxModel(txHash, pendingBlock.timestamp, account),
  //           account,
  //           time: pendingBlock.timestamp * 1000
  //         }
  //         return new TransferNoticeModel(noticeModel)
  //       })
  //     })
  //   })
  // }

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
