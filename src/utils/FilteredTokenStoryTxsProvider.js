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
            Object.keys(filter).forEach((field) => (!filter[field]) && delete filter[field]) // remove empty field
          }

          const eventName = this.filter.get('action')
          const event = eventName ? contract[eventName](filter, {fromBlock, toBlock})
            : contract.allEvents({fromBlock, toBlock})

          event.get((e, txs) => {
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
