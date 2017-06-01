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
            hash: this.filter.get('hash'),
            from: this.filter.get('from'),
            to: this.filter.get('to')
          }

          Object.keys(filter).forEach((field) => (!filter[field]) && delete filter[field]) // remove empty field

          const isEmptyFilter = Object.keys(filter).length === 0


          let event
          if (eventName) {
            event = deployed[eventName](filter, { fromBlock, toBlock})
          } else {
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
                console.log(arguments)
                resolve(txs1.concat(txs2).concat(txs3))
              })

              return
            }
          }

          console.log(event)

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