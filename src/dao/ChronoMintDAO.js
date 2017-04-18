import { Map } from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import TransactionModel from '../models/TransactionModel'

class ChronoMintDAO extends AbstractContractDAO {
  getAccountETHBalance (account) {
    return new Promise(resolve => {
      this.web3.eth.getBalance(account, (e, r) => {
        if (e) {
          return resolve(0)
        }
        resolve(this.web3.fromWei(r.toNumber()))
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
                map = map.set(tx.hash, new TransactionModel({
                  txHash: tx.hash,
                  nonce: tx.nonce,
                  blockHash: tx.blockHash,
                  blockNumber: tx.blockNumber,
                  transactionIndex: tx.transactionIndex,
                  from: tx.from,
                  to: tx.to,
                  value: tx.value.toNumber(),
                  time: r.timestamp,
                  gasPrice: tx.gasPrice,
                  gas: tx.gas,
                  input: tx.input,
                  credited: tx.to === account,
                  symbol: 'ETH'
                }))
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

export default new ChronoMintDAO(require('../contracts/ChronoMint.json'))
