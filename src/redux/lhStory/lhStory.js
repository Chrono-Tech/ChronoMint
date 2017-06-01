import { Map } from 'immutable'
import DAORegistry from '../../dao/DAORegistry'
import TxsPaginator from '../../utils/TxsPaginator'

export const LH_STORY_TRANSACTIONS = 'lhStory/TRANSACTIONS'
export const LH_STORY_TRANSACTIONS_FETCH = 'lhStory/TRANSACTIONS_FETCH'
export const LH_STORY_TRANSACTIONS_FETCH_NEXT = 'lhStory/TRANSACTIONS_FETCH_NEXT'

const initialState = {
  transactions: new Map(),
  isFetching: false,
  toBlock: null,
  isFetched: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LH_STORY_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions,
        isFetched: true,
        isFetching: false
      }
    case LH_STORY_TRANSACTIONS_FETCH_NEXT:
      return {
        ...state,
        transactions: state.transactions.merge(action.map),
        toBlock: action.toBlock,
        isFetched: true,
        isFetching: false
      }
    case LH_STORY_TRANSACTIONS_FETCH:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

let platformEmitterDAO

/* DAORegistry.getPlatformEmitterDAO().then((eventsDAO) => {
  eventsDAO.contract.then((deployed) => {
    deployed.allEvents().watch((e, r) => {

    })
  })
}) */

const paginator = new TxsPaginator((toBlock, fromBlock) => {
  return new Promise((resolve) => {
    DAORegistry.getPlatformEmitterDAO().then((eventsDAO) => {
      platformEmitterDAO = eventsDAO
      eventsDAO.contract.then((deployed) => {
        deployed.allEvents({fromBlock: fromBlock, toBlock: toBlock}).get((e, txs) => {
          txs = txs.filter((tx) => { return tx.event === 'Issue' || tx.event === 'Transfer' || tx.event === 'Approve' })
          console.log(txs)
          resolve(txs)
        })
      })
    })
  })
})
paginator.sizePage = 2 // TODO @sashaaro: 10

export const nextStoryList = () => (dispatch) => {
  dispatch({type: LH_STORY_TRANSACTIONS_FETCH})

  paginator.findNext().then((txs) => {
    platformEmitterDAO.prepareTxsMap(txs).then((map) => {
      dispatch({type: LH_STORY_TRANSACTIONS_FETCH_NEXT, map, toBlock: paginator.isDone ? null : paginator.lastBlockNubmer})
    })
  })
}

export default reducer
