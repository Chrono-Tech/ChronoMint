import DAORegistry from '../dao/DAORegistry'
import { TxsProviderInterface } from './TxsPaginator'
import TokenStoryFilterModel from '../models/TokenStoryFilterModel'

export default class FilteredTokenStoryTxsProvider extends TxsProviderInterface {
  constructor () {
    super()
    this.filter = new TokenStoryFilterModel()
  }

  find(toBlock: number, fromBlock: number): Promise<Array<Object>> {
    return new Promise((resolve) => {
      DAORegistry.getPlatformEmitterDAO().then((eventsDAO) => {
        eventsDAO.contract.then((deployed) => {
          let event = 'allEvents'
          if (this.filter.get('action')) {
            event = this.filter.get('action')
          }

          console.log(event, fromBlock, toBlock)
          deployed[event]({
            fromBlock: fromBlock, toBlock: toBlock,
            //from: '0x8f5a67e3cbab4596ad872f50702efd87c86acd51'
          }).get((e, txs) => {
            if (e) {
              console.log(e)
              return
            }
            console.log(txs)
            if (event === 'allEvents') {
              txs = txs.filter((tx) => { return tx.event === 'Issue' || tx.event === 'Transfer' || tx.event === 'Approve' })
            }
            resolve(txs)
          })
        })
      })
    })
  }
}