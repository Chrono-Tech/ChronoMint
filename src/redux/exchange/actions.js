import ExchangeDAO from '../../dao/ExchangeDAO'
import web3Provider from '../../network/Web3Provider'
import {
  EXCHANGE_RATES,
  EXCHANGE_RATES_FETCH,
  EXCHANGE_TRANSACTIONS,
  EXCHANGE_TRANSACTIONS_FETCH
} from './reducer'
import AssetModel from '../../models/AssetModel'

export const getTransactions = (account, toBlock) => (dispatch) => {
  dispatch({type: EXCHANGE_TRANSACTIONS_FETCH})

  return new Promise(resolve => {
    if (toBlock) {
      resolve(toBlock)
    } else {
      resolve(web3Provider.getBlockNumber())
    }
  }).then(resolvedBlock => {
    const fromBlock = Math.max(resolvedBlock - 100, 0)
    ExchangeDAO.getTransactions(fromBlock, toBlock).then(transactions => {
      dispatch({
        type: EXCHANGE_TRANSACTIONS,
        transactions,
        toBlock: fromBlock - 1
      })
    })
  })
}

export const getRates = () => (dispatch) => {
  dispatch({type: EXCHANGE_RATES_FETCH})
  return ExchangeDAO.getRates().then((rate: AssetModel) => {
    dispatch({
      type: EXCHANGE_RATES,
      rate
    })
  })
}

export const exchangeCurrency = (isBuy, amount, rates: AssetModel) => (dispatch) => {
  let action
  if (isBuy) {
    action = ExchangeDAO.buy(amount, rates.sellPrice())
  } else {
    action = ExchangeDAO.sell(amount, rates.buyPrice())
  }
  return action.then(result => {
    // TODO @dkchv: update transactions
    console.log('--actions#r', result)
  })
}
