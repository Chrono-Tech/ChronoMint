import Web3Provider from '../network/Web3Provider'

export default class TxsPaginator {
  constructor (txsProvider = null) {
    this.txsProvider = txsProvider
    this.endBlock = 0; // contract's block

    if (this.txsProvider === null) {
      this.txsProvider = this._defaultTxsProvider
    }

    this.sizePage = 20

    this.lastBlockNubmer = null
    this.lastTxAddress = null // TODO use
  }

  /**
   * @param toBlock
   * @param fromBlock
   * @return {Promise.<Array>}
   * @private
   */
  _defaultTxsProvider(toBlock, fromBlock) {
    return new Promise((resolve) => {
      const promises = []

      for (let i = fromBlock; i <= toBlock; i++) {
        promises.push(this._asyncFetchTxsByBlock(i))
      }

      Promise.all(promises).then(values => {
        let allTxs = []
        values.forEach(txs => {
          allTxs.merge(txs)
        })

        resolve(allTxs)
      })
    })
  }

  /**
   * @private
   */
  _asyncFetchTxsByBlock = (block): Promise => {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBlock(block, true, (e, r) => {
        if (e) {
          reject(e)
        } else {
          resolve(r.transactions)
        }
      })
    })
  }

  useAccountFilter(account) {
    this.filter = (tx) => {
      return (tx.args.to === account || tx.args.from === account)// && tx.value > 0
    }
  }

  /**
   * @param toBlock
   * @param limit fetched block per one promise.all
   */
  recursiveFind(toBlock, limit): Promise {
    return new Promise((resolve) => {
      let fromBlock = toBlock - 1000

      if (fromBlock < this.endBlock) {
        if (toBlock > this.endBlock) {
          fromBlock = this.endBlock
        } else {
          return [];
        }
      }

      this.txsProvider(toBlock, fromBlock).then((allTxs) => {
        if (this.filter) {
          allTxs = allTxs.filter(this.filter)
        }

        if (allTxs.length < limit) {
          if (fromBlock > this.endBlock) {
            let missedCount = limit - allTxs.length
            let paginatePromise = this.recursiveFind(fromBlock, missedCount)
            paginatePromise.then((nextTxs) => {
              allTxs.merge(nextTxs)
              resolve(allTxs)
            }).catch((e) => {
              console.log(e)
            })
          } else {
            resolve(allTxs)
          }
        } else if (allTxs.length === limit) {
          resolve(allTxs)
        } else { // txs more than sizePage
          resolve(allTxs.slice(allTxs.length - 1, allTxs.length))
          // TODO allTxs.slice(0, allTxs.length - 1) be cached
        }
      })

    })
  }

  findNext(): Promise {
    if (this.lastBlockNubmer) {
      return this.find(this.lastBlockNubmer)
    } else {
      return new Promise((resolve, reject) => {
        Web3Provider._web3instance.eth.getBlockNumber((e, toBlock) => {
          if (e) {
            reject(e)
          } else {
            this.find(toBlock).then((txs) => {
              resolve(txs)
            })
          }
        })
      })
    }
  }

  find(toBlock: number): Promise {
    return this.recursiveFind(toBlock, this.sizePage).then((txs) => {
      if (txs.length) {
        const lastTx = txs[0]
        this.lastBlockNubmer = lastTx.blockNumber - 1 // TODO lastTx.blockNumber
        this.lastTxAddress = lastTx.address
      }

      return txs
    })
  }
}