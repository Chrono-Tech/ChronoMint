import ExchangeDAO from '../../dao/ExchangeDAO'
import web3Provider from '../../network/Web3Provider'
import {
  EXCHANGE_RATES,
  EXCHANGE_RATES_FETCH,
  EXCHANGE_TRANSACTION,
  EXCHANGE_TRANSACTIONS,
  EXCHANGE_TRANSACTIONS_FETCH,
  EXCHANGE_BALANCE,
  EXCHANGE_BALANCE_FETCH
} from './reducer'
import AssetModel from '../../models/AssetModel'
import { updateCMLHTBalance, updateETHBalance, updateLHTBalance } from '../wallet/actions'
import { showAlertModal } from '../ui/modal'

export const exchangeTransaction = (tx) => (dispatch) => {
  dispatch({type: EXCHANGE_TRANSACTION, tx})
}

export const getTransactions = (toBlock) => (dispatch) => {
  dispatch({type: EXCHANGE_TRANSACTIONS_FETCH})

  return new Promise(resolve => {
    if (toBlock) {
      resolve(toBlock)
    } else {
      resolve(web3Provider.getBlockNumber())
    }
  }).then(resolvedBlock => {
    const fromBlock = Math.max(resolvedBlock - 100, 1)
    return ExchangeDAO.getTransactions(fromBlock, toBlock).then(transactions => {
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

export const updateExchangeETHBalance = () => (dispatch) => {
  dispatch({type: EXCHANGE_BALANCE_FETCH})
  return ExchangeDAO.getBalance()
    .then(balance => dispatch({type: EXCHANGE_BALANCE, balance}))
}

export const exchangeCurrency = (isBuy, amount, rates: AssetModel) => (dispatch) => {
  let action
  if (isBuy) {
    action = ExchangeDAO.buy(amount, rates.sellPrice())
  } else {
    action = ExchangeDAO.sell(amount, rates.buyPrice())
  }
  return action.then(() => {
    if (isBuy) {
      dispatch(updateETHBalance())
      dispatch(updateCMLHTBalance())
    } else {
      dispatch(updateLHTBalance())
      dispatch(updateExchangeETHBalance())
    }
  }).catch(e => {
    dispatch(showAlertModal({
      title: 'Exchange error',
      message: e.message
    }))
  })
}
