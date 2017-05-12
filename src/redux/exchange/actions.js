import ExchangeDAO from '../../dao/ExchangeDAO'
import web3Provider from '../../network/Web3Provider'
import {
  EXCHANGE_RATES,
  EXCHANGE_RATES_FETCH,
  EXCHANGE_TRANSACTION,
  EXCHANGE_TRANSACTIONS,
  EXCHANGE_TRANSACTIONS_FETCH
} from './reducer'
import AssetModel from '../../models/AssetModel'
import { updateETHBalance, updateLHTBalance } from '../wallet/actions'
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

export const exchangeCurrency = (isBuy, amount, rates: AssetModel) => (dispatch) => {
  let action
  if (isBuy) {
    action = ExchangeDAO.buy(amount, rates.sellPrice())
  } else {
    action = ExchangeDAO.sell(amount, rates.buyPrice())
  }
  return action.then(() => {
    dispatch(updateLHTBalance())
    dispatch(updateETHBalance())
  }).catch(e => {
    if (ExchangeDAO.isThrowInCotract(e)) {
      return dispatch(showAlertModal({
        title: 'Exchange error',
        message: 'Planform hasn\'t enouth tokens for selling you.'
      }))
    }
  })
}
