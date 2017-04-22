import {List, Map} from 'immutable'
import LHTProxyDAO from '../../dao/LHTProxyDAO'
import PlatformEmitterDAO from '../../dao/PlatformEmitterDAO'
import ChronoMintDAO from '../../dao/ChronoMintDAO'

export const LH_STORY_LIST = 'lhStory/LIST'
export const LH_STORY_TRANSACTIONS_FETCH = 'lhStory/TRANSACTIONS_FETCH'
export const LH_STORY_TRANSACTIONS = 'lhStory/TRANSACTIONS'

export const initialState = {
  isFetching: false,
  list: new List(),
  transactions: new Map(),
  toBlock: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LH_STORY_LIST:
      return {
        ...state,
        list: action.list
      }
    case LH_STORY_TRANSACTIONS_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case LH_STORY_TRANSACTIONS:
      return {
        ...state,
        isFetching: false,
        transactions: state.transactions.merge(action.map),
        toBlock: action.toBlock
      }
    default:
      return state
  }
}

const listStory = () => (dispatch) => {
  PlatformEmitterDAO.watchTransfer((error, result) => {
    if (!error) {
      console.log('LH STORY', result)
    }
  }, 1)

  let list = new List()
  list = list.set(0, 'Abc')
  list = list.set(1, 'Xyz')
  dispatch({type: LH_STORY_LIST, list})
}

const getLHTransactions = (account, toBlock) => (dispatch) => {
  dispatch({ type: LH_STORY_TRANSACTIONS_FETCH })

  const callback = (toBlock) => {
    const fromBlock = toBlock - 100 < 0 ? 0 : toBlock - 100
    LHTProxyDAO.getTransfer(account, fromBlock, toBlock).then(values => {
      dispatch({ type: LH_STORY_TRANSACTIONS, map: values, toBlock: fromBlock - 1 })
    })
  }

  if (!toBlock) {
    ChronoMintDAO.web3.eth.getBlockNumber((e, r) => {
      callback(e ? 0 : r)
    })
  } else {
    callback(toBlock)
  }
}

export {
  listStory,
  getLHTransactions
}

export default reducer
