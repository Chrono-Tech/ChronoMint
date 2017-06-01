import { Map } from 'immutable'
import TxsPaginator from '../../utils/TxsPaginator'
import FilteredTokenStoryTxsProvider from '../../utils/FilteredTokenStoryTxsProvider'
import TokenStoryFilterModel from '../../models/TokenStoryFilterModel'
import PlatformEmitterDAO from '../../dao/PlatformEmitterDAO'

export const LH_STORY_TRANSACTIONS = 'lhStory/TRANSACTIONS'
export const LH_STORY_TRANSACTIONS_FETCH = 'lhStory/TRANSACTIONS_FETCH'
export const LH_STORY_TRANSACTIONS_FETCH_NEXT = 'lhStory/TRANSACTIONS_FETCH_NEXT'
export const LH_STORY_TRANSACTIONS_CLEAR = 'lhStory/TRANSACTIONS_FETCH_CLEAR'

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
    case LH_STORY_TRANSACTIONS_CLEAR:
      return {
        ...state,
        transactions: new Map()
      }
    default:
      return state
  }
}

/* DAORegistry.getPlatformEmitterDAO().then((eventsDAO) => {
  eventsDAO.contract.then((deployed) => {
    deployed.allEvents().watch((e, r) => {

    })
  })
}) */

const paginator = new TxsPaginator(new FilteredTokenStoryTxsProvider())
paginator.sizePage = 2 // TODO @sashaaro: 10

export const nextStoryList = () => (dispatch, getState) => {
  dispatch({type: LH_STORY_TRANSACTIONS_FETCH})

  paginator.findNext().then((txs) => {
    PlatformEmitterDAO.prepareTxsMap(txs).then((map) => {
      dispatch({type: LH_STORY_TRANSACTIONS_FETCH_NEXT, map, toBlock: paginator.isDone ? null : paginator.lastBlockNubmer})
    })
  })
}

export const updateListByFilter = (filter: TokenStoryFilterModel) => (dispatch) => {
  dispatch({type: LH_STORY_TRANSACTIONS_CLEAR})

  paginator.reset()
  paginator.txsProvider.filter = filter
  dispatch(nextStoryList())
}

export default reducer
