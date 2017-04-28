import { Map } from 'immutable'
import ExchangeDAO from '../../dao/ExchangeDAO'
import TransactionModel from '../../models/TransactionModel.js'

const EXCHANGE_TRANSACTIONS_LOAD_START = 'exchange/TRANSACTIONS_LOAD_START'
const EXCHANGE_TRANSACTIONS_LOAD_SUCCESS = 'exchange/TRANSACTIONS_LOAD_SUCCESS'
const EXCHANGE_TRANSACTIONS_LOAD_END = 'exchange/TRANSACTIONS_LOAD_END'
export const fetchTransactionsStart = () => ({type: EXCHANGE_TRANSACTIONS_LOAD_START})
export const fetchTransactionsSuccess = (payload) => ({type: EXCHANGE_TRANSACTIONS_LOAD_SUCCESS, payload})
export const fetchTransactionsEnd = () => ({type: EXCHANGE_TRANSACTIONS_LOAD_END})

const initialState = {
  isFetching: true,
  transactions: new Map()
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
        transactions: state.transactions.set(action.payload.txHash, new TransactionModel(action.payload))
      }
    default:
      return state
  }
}

export const getTransactions = (account, count, endBlock) => (dispatch) => {
  dispatch(fetchTransactionsStart())

  function getTransactionCallback (e, r) {
    console.log(r)
    if (r.length > 0) {
      ExchangeDAO.getTokenSymbol().then(symbol => {
        r.forEach(txn => {
          ExchangeDAO.web3.eth.getBlock(txn.blockHash, (e, block) => {
            dispatch(fetchTransactionsSuccess({
              txHash: txn.transactionHash,
              blockHash: txn.blockHash,
              blockNumber: txn.blockNumber,
              transactionIndex: txn.transactionIndex,
              value: txn.args.token,
              time: block.timestamp,
              credited: txn.event === 'Buy',
              symbol
            }))
          })
        })
      })
    } else {
      dispatch(fetchTransactionsEnd())
    }
  }

  function watchTransactionCallback (e, txn) {
    ExchangeDAO.getTokenSymbol().then(symbol => {
      ExchangeDAO.web3.eth.getBlock(txn.blockHash, (e, block) => {
        dispatch(fetchTransactionsSuccess({
          txHash: txn.transactionHash,
          blockHash: txn.blockHash,
          blockNumber: txn.blockNumber,
          transactionIndex: txn.transactionIndex,
          value: txn.args.token,
          time: block.timestamp,
          credited: txn.event === 'Buy',
          symbol
        }))
      })
    })
  }

  const callback = (toBlock) => {
    const fromBlock = toBlock - count > 0 ? toBlock - count : 0

    ExchangeDAO.getSell(getTransactionCallback, account, {fromBlock, toBlock})
    ExchangeDAO.getBuy(getTransactionCallback, account, {fromBlock, toBlock})

    ExchangeDAO.watchSell(watchTransactionCallback, account)
    ExchangeDAO.watchBuy(watchTransactionCallback, account)
  }

  if (!endBlock) {
    ExchangeDAO.web3.eth.getBlockNumber((e, r) => {
      callback(r)
    })
  } else {
    callback(endBlock)
  }
}

export default reducer
