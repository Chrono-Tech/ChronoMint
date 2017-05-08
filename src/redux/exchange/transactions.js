import { Map } from 'immutable'
import ExchangeDAO from '../../dao/ExchangeDAO'
import web3Provider from '../../network/Web3Provider'

const EXCHANGE_TRANSACTIONS_LOAD_START = 'exchange/TRANSACTIONS_LOAD_START'
const EXCHANGE_TRANSACTIONS_LOAD_SUCCESS = 'exchange/TRANSACTIONS_LOAD_SUCCESS'
const EXCHANGE_TRANSACTIONS_LOAD_END = 'exchange/TRANSACTIONS_LOAD_END'

const initialState = {
  isFetching: true,
  transactions: new Map(),
  toBlock: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EXCHANGE_TRANSACTIONS_LOAD_START:
      return {
        ...state,
        isFetching: true
      }
    case EXCHANGE_TRANSACTIONS_LOAD_END:
      return {
        ...state,
        isFetching: false
      }
    case EXCHANGE_TRANSACTIONS_LOAD_SUCCESS:
      return {
        isFetching: false,
        transactions: state.transactions.merge(action.transactions),
        toBlock: action.toBlock
      }
    default:
      return state
  }
}

export const getTransactions = (account, toBlock) => (dispatch) => {
  dispatch({type: EXCHANGE_TRANSACTIONS_LOAD_START})

  return new Promise(resolve => {
    if (toBlock) {
      resolve(toBlock)
    } else {
      resolve(web3Provider.getBlockNumber())
    }
  }).then(resolvedBlock => {
    const fromBlock = Math.max(resolvedBlock - 100, 0)
    return Promise.all([
      ExchangeDAO.getTransactionsByType('Sell', account, {fromBlock, toBlock}),
      ExchangeDAO.getTransactionsByType('Buy', account, {fromBlock, toBlock})
    ]).then(([txSell, txBuy]) => {
      dispatch({
        type: EXCHANGE_TRANSACTIONS_LOAD_SUCCESS,
        transactions: txSell.merge(txBuy),
        toBlock: fromBlock - 1
      })
      dispatch({type: EXCHANGE_TRANSACTIONS_LOAD_END})
    })
  })
}

export default reducer
