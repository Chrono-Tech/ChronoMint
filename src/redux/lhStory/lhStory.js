import { Map } from 'immutable'
import LHTProxyDAO from '../../dao/LHTProxyDAO'
import TxsPaginator from '../../utils/TxsPaginator'

export const LH_STORY_LIST = 'lhStory/LIST'
export const LH_STORY_LIST_FETCH = 'lhStory/LIST_FETCH'
export const LH_STORY_LIST_FETCH_NEXT = 'lhStory/LIST_FETCH_NEXT'

const initialState = {
  list: new Map(),
  isFetching: false,
  toBlock: null,
  isFetched: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LH_STORY_LIST:
      return {
        ...state,
        list: action.transactions,
        isFetched: true,
        isFetching: false
      }
    case LH_STORY_LIST_FETCH_NEXT:
      return {
        ...state,
        list: state.list.merge(action.map),
        toBlock: action.toBlock,
        isFetched: true,
        isFetching: false
      }
    case LH_STORY_LIST_FETCH:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

const paginator = new TxsPaginator(LHTProxyDAO.findRawTxs.bind(LHTProxyDAO))
paginator.sizePage = 2 // TODO 100

const nextStoryList = () => (dispatch) => {
  dispatch({type: LH_STORY_LIST_FETCH})

  paginator.findNext().then((txs) => {
    LHTProxyDAO.prepareTxsMap(txs).then((map) => {
      dispatch({type: LH_STORY_LIST_FETCH_NEXT, map, toBlock: paginator.isDone ? null : paginator.lastBlockNubmer})
    })
  })
}

export {
  nextStoryList
}

export default reducer
