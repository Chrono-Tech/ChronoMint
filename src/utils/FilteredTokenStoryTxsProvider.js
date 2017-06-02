import DAORegistry from '../dao/DAORegistry'
import { TxsProviderInterface } from './TxsPaginator'
import TokenStoryFilterModel, { TOKEN_STORY_ACTION_TRANSFER } from '../models/TokenStoryFilterModel'

/**
 * For paginator
 */
export default class FilteredTokenStoryTxsProvider extends TxsProviderInterface {
  constructor () {
    super()
    this.filter = new TokenStoryFilterModel()
  }


  find (toBlock: number, fromBlock: number): Promise<Array<Object>> {
    return new Promise((resolve) => {
      DAORegistry.getPlatformEmitterDAO().then((eventsDAO) => {
        eventsDAO.contract.then((contract) => {
          const filter = {}

          if (this.filter.get('action') === TOKEN_STORY_ACTION_TRANSFER) {
            filter.from = this.filter.get('from')
            filter.to = this.filter.get('to')
          }
          filter.symbol = this.filter.get('token')

          Object.keys(filter).forEach((field) => (!filter[field]) && delete filter[field]) // remove empty field
          const isEmptyFilter = Object.keys(filter).length === 0
          const eventName = this.filter.get('action')

          let web3Filter
          if (eventName) {
            web3Filter = contract[eventName](filter, {fromBlock, toBlock})
          } else {
            if (isEmptyFilter) {
              web3Filter = contract.allEvents({fromBlock, toBlock})
            } else {
              const _createPromise = (eventName) => {
                return new Promise((resolve) => {
                  contract[eventName](filter, { fromBlock, toBlock}).get((e, txs) => {
                    resolve(txs)
                  })
                })
              }

              Promise.all([
                _createPromise('Transfer'),
                _createPromise('Issue'),
                _createPromise('Approve')
              ]).then(([txs1, txs2, txs3]) => {
                resolve(txs1.concat(txs2).concat(txs3))
              })

              return
            }
          }

          web3Filter.get((e, txs) => {
            if (e) {
              console.log(e)
              return
            }

            if (!eventName) {
              txs = txs.filter((tx) => { return tx.event === 'Issue' || tx.event === 'Transfer' || tx.event === 'Approve' })
            }
            resolve(txs)
          })
        })
      })
    })
  }
}
