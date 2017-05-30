import { Map } from 'immutable'
import LHTProxyDAO from '../../dao/LHTProxyDAO'
import TIMEProxyDAO from '../../dao/TIMEProxyDAO'
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
        transactions: state.map.merge(action.map),
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

const paginator = new TxsPaginator((toBlock, fromBlock) => {
  return new Promise((resolve) => {
    Promise.all([
      LHTProxyDAO.findRawTxs(toBlock, fromBlock),
      TIMEProxyDAO.findRawTxs(toBlock, fromBlock)
    ]).then(([LHTtxs, TIMEtxs]) => {
      resolve(LHTtxs.concat(TIMEtxs))
    })
  })
})
paginator.sizePage = 2 // TODO 100

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
