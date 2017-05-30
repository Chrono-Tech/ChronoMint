import Web3Provider from '../network/Web3Provider'

export default class TxsPaginator {
  constructor (txsProvider = null) {
    this.txsProvider = txsProvider
    this.endBlock = 0 // contract's block

    if (this.txsProvider === null) {
      this.txsProvider = this._defaultTxsProvider
    }

    this.sizePage = 20
    this.isDone = false

    this.lastBlockNubmer = null
    this.lastTxAddress = null
    this.recursiveDepthCount = 0
    this.recursiveDepthLimit = 30
  }

  /**
   * @param toBlock
   * @param fromBlock
   * @return {Promise.<Array>}
   * @private
   */
  _defaultTxsProvider (toBlock, fromBlock) {
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
  _asyncFetchTxsByBlock (block): Promise {
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

  useAccountFilter (account) {
    this.filter = (tx) => {
      return (tx.args.to === account || tx.args.from === account)// && tx.value > 0
    }
  }

  /**
   * @param toBlock
   * @param limit fetched block per one promise.all
   */
  recursiveFind (toBlock, limit): Promise {
    return new Promise((resolve) => {
      ++this.recursiveDepthCount

      if (this.recursiveDepthCount > this.recursiveDepthLimit) {
        resolve([])
      }

      let fromBlock = toBlock - 1000

      if (fromBlock < this.endBlock) {
        if (toBlock > this.endBlock) {
          fromBlock = this.endBlock
        } else {
          return []
        }
      }

      this.txsProvider(toBlock, fromBlock).then((allTxs) => {
        if (this.filter) {
          allTxs = allTxs.filter(this.filter)
        }

        if (this.lastTxAddress) {
          for (let i = 0; i < allTxs.length; i++) {
            let transaction = allTxs[i]
            if (this._txID(transaction) === this.lastTxAddress) {
              allTxs = allTxs.slice(0, i)
              break
            }
          }
        }

        if (allTxs.length < limit) {
          if (fromBlock > this.endBlock) {
            let missedCount = limit - allTxs.length
            let paginatePromise = this.recursiveFind(fromBlock, missedCount)
            paginatePromise.then((nextTxs) => {
              allTxs = allTxs.concat(nextTxs)
              resolve(allTxs)
            })
          } else {
            resolve(allTxs)
          }
        } else if (allTxs.length === limit) {
          resolve(allTxs)
        } else { // txs more than sizePage
          allTxs = allTxs.slice(allTxs.length - limit, allTxs.length)
          resolve(allTxs)
          // TODO allTxs.slice(0, limit) be cached
        }
      })
    })
  }

  findNext (): Promise {
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

  find (toBlock: number): Promise {
    this.recursiveDepthCount = 0
    return this.recursiveFind(toBlock, this.sizePage).then((txs) => {
      if (txs.length) {
        const lastTx = txs[0]
        this.lastBlockNubmer = lastTx.blockNumber
        this.lastTxAddress = this._txID(lastTx)
      }
      if (txs.length < this.sizePage) {
        this.isDone = true
      }

      return txs
    })
  }

  _txID (tx) {
    return tx.transactionHash + '-' + tx.args.from + '-' + tx.args.from + '-' + tx.logIndex
  }
}
