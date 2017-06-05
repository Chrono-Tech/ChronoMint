import Web3Provider from '../network/Web3Provider'

export default class TxsPaginator {
  constructor (txsProvider: TxsProviderInterface) {
    this.txsProvider = txsProvider
    this.endBlock = 0 // contract's block

    this.sizePage = 20
    this.isDone = false

    this.lastBlockNubmer = null
    this.lastTxAddress = null

    this._recursiveDepthCount = 0
    this.recursiveDepthLimit = 30
    this.blockStepSize = 1000 // fetch blocks per request
  }

  reset () {
    this.isDone = false
    this.lastBlockNubmer = null
    this.lastTxAddress = null
  }

  /**
   * @param toBlock
   * @param limit fetched block per one promise.all
   */
  recursiveFind (toBlock, limit): Promise {
    return new Promise((resolve) => {
      ++this._recursiveDepthCount

      if (this._recursiveDepthCount > this.recursiveDepthLimit) {
        resolve([])
        return
      }

      let fromBlock = toBlock - this.blockStepSize

      if (fromBlock < this.endBlock) {
        if (toBlock > this.endBlock) {
          fromBlock = this.endBlock
        } else {
          resolve([])
          return
        }
      }

      this.txsProvider.find(toBlock, fromBlock).then((allTxs) => {
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
            const missedCount = limit - allTxs.length
            this.recursiveFind(fromBlock, missedCount).then((nextTxs) => {
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
        Web3Provider.getWeb3instance().eth.getBlockNumber((e, toBlock) => {
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
    this._recursiveDepthCount = 0
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

  /**
   * @param tx raw response object from web3
   * @private
   */
  _txID (tx: Object): string {
    return tx.hash || tx.transactionHash
  }
}

export class TxsProviderInterface {
  /**
   * @returns {Promise.<Array<Object>>} list of txs from web3
   */
  find (toBlock: number, fromBlock: number): Promise<Array<Object>> {
    throw new Error('No implementation')
  }
}
