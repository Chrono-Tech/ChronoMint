import DAORegistry from '../dao/DAORegistry'
import { TxsProviderInterface } from './TxsPaginator'
import TokenStoryFilterModel from '../models/TokenStoryFilterModel'

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
        eventsDAO.contract.then((deployed) => {
          const eventName = this.filter.get('action')

          const filter = {
            from: this.filter.get('from'),
            to: this.filter.get('to')
          }

          Object.keys(filter).forEach((field) => (!filter[field]) && delete filter[field]) // remove empty field

          const isEmptyFilter = Object.keys(filter).length === 0

          let event
          if (eventName) {
            event = deployed[eventName](filter, { fromBlock, toBlock})
          } else {
            // TODO @sashaaro resolve get allow filter params by each event, compare with given and exclude excess events. example Issue don't apply `from` `to`
            if (isEmptyFilter) {
              event = deployed.allEvents({ fromBlock, toBlock})
            } else {
              const transferPromise = new Promise((resolve) => {
                deployed['Transfer'](filter, { fromBlock, toBlock}).get((e, txs) => {
                  resolve(txs)
                })
              })
              const issuePromise = new Promise((resolve) => {
                deployed['Issue'](filter, { fromBlock, toBlock}).get((e, txs) => {
                  resolve(txs)
                })
              })
              const approvePromise = new Promise((resolve) => {
                if (filter.to) {
                  filter.spender = filter.to
                  delete filter['to']
                }
                deployed['Approve']({...filter, spender: filter.to}, { fromBlock, toBlock}).get((e, txs) => {
                  resolve(txs)
                })
              })
              const promises = [
                transferPromise,
                issuePromise,
                approvePromise
              ]

              Promise.all(promises).then(([txs1, txs2, txs3]) => {
                resolve(txs1.concat(txs2).concat(txs3))
              })

              return
            }
          }

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