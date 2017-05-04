import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import LS from './LocalStorageDAO'
import TransactionModel from '../models/TransactionModel'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'
import web3Provider from '../network/Web3Provider'

class ChronoMintDAO extends AbstractContractDAO {
  getAccountETHBalance (account) {
    return new Promise(resolve => {
      this.web3.eth.getBalance(account, (e, r) => {
        if (e) {
          return resolve(0)
        }
        resolve(this.fromWei(r.toNumber()))
      })
    })
  }

  /**
   * @param tx
   * @param time
   * @param account
   * @returns {TransactionModel}
   * @private
   */
  _getTxModel (tx, time, account) {
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
    const account = LS.getAccount()
    const transaction = {
      from: account,
      to,
      value: this.toWei(parseFloat(amount, 10))
    }

    return web3Provider.sendTransaction(transaction).then(sendedTxHash => {
      return web3Provider.getBlock('pending').then(pendingBlock => {
        const filteredTx = pendingBlock.transactions.filter(tx => sendedTxHash === tx)
        if (!filteredTx) {
          throw new Error('tx not found in pending block')
        }

        return web3Provider.getTransaction(sendedTxHash).then(txHash => {
          const noticeModel = {
            tx: this._getTxModel(txHash, pendingBlock.timestamp, account),
            account,
            time: pendingBlock.timestamp * 1000
          }
          return new TransferNoticeModel(noticeModel)
        })
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
                const txModel: TransactionModel = this._getTxModel(tx, r.timestamp, account)
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
