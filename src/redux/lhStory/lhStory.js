import { Map } from 'immutable'
import LHTProxyDAO from '../../dao/LHTProxyDAO'
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

const paginator = new TxsPaginator(LHTProxyDAO.findRawTxs.bind(LHTProxyDAO))
paginator.sizePage = 2 // TODO @sashaaro: 100

const nextStoryList = () => (dispatch) => {
  dispatch({type: LH_STORY_TRANSACTIONS_FETCH})

  paginator.findNext().then((txs) => {
    LHTProxyDAO.prepareTxsMap(txs).then((map) => {
      dispatch({type: LH_STORY_TRANSACTIONS_FETCH_NEXT, map, toBlock: paginator.isDone ? null : paginator.lastBlockNubmer})
    })
  })
}

export { nextStoryList }

export default reducer
