import Web3Provider from '../network/Web3Provider'
import Immutable from 'immutable'

/**
 * Paginator for data that store in blocks (for example transactions)
 */
export default class BlockDataPaginator {
  constructor (provider: AbstractBlockDataProvider) {
    this.provider = provider
    this.endBlock = 0 // contract's block

    this.sizePage = 20
    this.isDone = false

    this.lastBlockNubmer = null
    this.lastDataID = null // last item ID

    this._recursiveDepthCount = 0
    this.recursiveDepthLimit = 30
    this.blockStepSize = 1000 // fetch blocks per request
  }

  reset () {
    this.isDone = false
    this.lastBlockNubmer = null
    this.lastDataID = null
  }

  /**
   * @param toBlock {string}
   * @param limit {number} fetched blocks per one request
   */
  recursiveFind (toBlock: string, limit: number): Promise<Array<Object>|Immutable.Map<string, Object>> {
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

      this.provider.find(toBlock, fromBlock).then((dataCollection) => {
        const isImmutable = dataCollection.constructor === Immutable.Map
        if (isImmutable) {
          dataCollection = dataCollection.toArray()
        }
        if (this.lastDataID) {
          for (let i = 0; i < dataCollection.length; i++) {
            const transaction = dataCollection[i]
            if (this.provider.resolveID(transaction) === this.lastDataID) {
              dataCollection = dataCollection.slice(0, i)
              break
            }
          }
        }

        if (dataCollection.length < limit) {
          if (fromBlock > this.endBlock) {
            const missedCount = limit - dataCollection.length
            this.recursiveFind(fromBlock, missedCount).then((nextDataCollection) => {
              dataCollection = dataCollection.concat(nextDataCollection)
              resolve(isImmutable ? this._arrayToMap(dataCollection) : dataCollection)
            })
          } else {
            resolve(isImmutable ? this._arrayToMap(dataCollection) : dataCollection)
          }
        } else if (dataCollection.length === limit) {
          resolve(isImmutable ? this._arrayToMap(dataCollection) : dataCollection)
        } else { // dataCollection more than sizePage
          dataCollection = dataCollection.slice(dataCollection.length - limit, dataCollection.length)
          resolve(isImmutable ? this._arrayToMap(dataCollection) : dataCollection)
        }
      })
    })
  }

  _arrayToMap(list: Array<Object>): Immutable.Map {
    const map = {};
    list.forEach((item) => {
      const id = this.provider.resolveID(item)
      map[id] = item
    })
    return new Immutable.Map(map)
  }

  findNext (): Promise<Array<Object>|Immutable.Map<string, Object>> {
    if (this.lastBlockNubmer) {
      return this.find(this.lastBlockNubmer)
    } else {
      return new Promise((resolve) => {
        Web3Provider.getWeb3instance().eth.getBlockNumber((e, toBlock) => {
          if (e) {
            throw new Error(e)
          } else {
            this.find(toBlock).then((dataCollection) => {
              resolve(dataCollection)
            })
          }
        })
      })
    }
  }

  find (toBlock: number): Promise<Array<Object>|Immutable.Map<string, Object>> {
    this._recursiveDepthCount = 0
    return this.recursiveFind(toBlock, this.sizePage).then((dataCollection: Array<Object>|Immutable.Map<string, Object>) => {
      const isImmutable = dataCollection.constructor === Immutable.Map
      if (isImmutable) {
        dataCollection = dataCollection.toArray()
      }
      if (dataCollection.length) {
        const lastItem = dataCollection[0]
        this.lastBlockNubmer = this.provider.resolveBlockNumber(lastItem)
        this.lastDataID = this.provider.resolveID(lastItem)
      }
      if (dataCollection.length < this.sizePage) {
        this.isDone = true
      }

      return isImmutable ? this._arrayToMap(dataCollection) : dataCollection
    })
  }
}

/**
 * Pagination provider
 */
export class AbstractBlockDataProvider {
  constructor () {
    if (new.target === AbstractBlockDataProvider) {
      throw new TypeError('Cannot construct AbstractBlockDataProvider instance directly')
    }
  }

  /**
   * Should return array of object these store in range of blocks
   * @param toBlock Number of the latest block. `latest` may be given
   * @param fromBlock Mumber of the earliest block
   */
  find (toBlock: number, fromBlock: number): Promise<Array<Object>|Immutable.Map<string, Object>> {
    throw new Error('Should be overridden')
  }

  /**
   * Return unique ID for every item
   */
  resolveID (item: Object): string|number {
    throw new Error('Should be overridden')
  }

  /**
   * Get blockNumber by item
   */
  resolveBlockNumber (item: Object): number {
    return item.blockNumber
  }
}
