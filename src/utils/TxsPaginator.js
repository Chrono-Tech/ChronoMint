import Web3Provider from '../network/Web3Provider'

export default class TxsPaginator {
  constructor (txsProvider) {
    this.txsProvider = txsProvider
    this.endBlock = 0 // contract's block

    this.sizePage = 20
    this.isDone = false

    this.lastBlockNubmer = null
    this.lastTxAddress = null
    this.recursiveDepthCount = 0
    this.recursiveDepthLimit = 30
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
        return
      }

      let fromBlock = toBlock - 1000

      if (fromBlock < this.endBlock) {
        if (toBlock > this.endBlock) {
          fromBlock = this.endBlock
        } else {
          resolve([])
          return
        }
      }

      this.txsProvider(toBlock, fromBlock).then((allTxs) => {
        if (this.filter) {
          allTxs = allTxs.filter(this.filter)
        }

        if (this.lastTxAddress) {
          for (let i = 0; i < allTxs.length; i++) {
            const transaction = allTxs[i]
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
          // TODO @sashaaro: allTxs.slice(0, limit) be cached
        }
      })
    })
  }

  findNext (): Promise {
    if (this.lastBlockNubmer) {
      return this.find(this.lastBlockNubmer)
    } else {
      return new Promise((resolve) => {
        Web3Provider._web3instance.eth.getBlockNumber((e, toBlock) => {
          if (e) {
            throw new Error(e)
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
    const hash = tx.hash || tx.transactionHash
    const to = tx.to || tx.args.to
    const from = tx.from || tx.args.from

    return hash + '-' + to + '-' + from
  }
}
