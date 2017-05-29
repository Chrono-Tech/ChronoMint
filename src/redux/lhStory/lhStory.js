import { Map } from 'immutable'
import LHTProxyDAO from '../../dao/LHTProxyDAO'
import LS from '../../utils/LocalStorage'
import TxsPaginator from '../../utils/TxsPaginator'


export const LH_STORY_LIST = 'lhStory/LIST'
export const LH_STORY_LIST_FETCH = 'lhStory/LIST_FETCH'
export const LH_STORY_LIST_FETCH_NEXT = 'lhStory/LIST_FETCH_NEXT'

const initialState = {
  list: new Map(),
  isFetching: false,
  toBlock: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LH_STORY_LIST:
      return {
        ...state,
        list: action.transactions,
        isFetching: false
      }
    case LH_STORY_LIST_FETCH_NEXT:
      return {
        ...state,
        list: state.list.merge(action.map),
        toBlock: action.toBlock,
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

let paginator = new TxsPaginator(LHTProxyDAO.findRawTxs.bind(LHTProxyDAO))
paginator.sizePage = 1
paginator.useAccountFilter(LS.getAccount())

const nextStoryList = () => (dispatch) => {
  paginator.findNext().then((txs) => {
    LHTProxyDAO.prepareTxsMap(txs, LS.getAccount()).then((map) => {
      dispatch({type: LH_STORY_LIST_FETCH_NEXT, map, toBlock: paginator.lastBlockNubmer})
    })
  })
}


const getStoryList = () => (dispatch) => {
  dispatch({type: LH_STORY_LIST_FETCH})
  /*LHTProxyDAO.getTransfer(LS.getAccount()).then((transactions) => {
    dispatch({type: LH_STORY_LIST, transactions})
  })*/



  LHTProxyDAO.getPaginateTransfer(LS.getAccount()).then((transactions) => {
    dispatch({type: LH_STORY_LIST, transactions})
  })
}

export {
  nextStoryList,
  getStoryList
}

export default reducer
