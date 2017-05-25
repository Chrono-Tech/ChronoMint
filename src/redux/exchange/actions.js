import ExchangeDAO from '../../dao/ExchangeDAO'
import web3Provider from '../../network/Web3Provider'
import AssetModel from '../../models/AssetModel'
import { updateETHBalance, updateLHTBalance } from '../wallet/actions'
import { showAlertModal } from '../ui/modal'

export const EXCHANGE_RATES_FETCH = 'exchange/RATES_FETCH'
export const EXCHANGE_RATES = 'exchange/RATES'
export const EXCHANGE_TRANSACTIONS_FETCH = 'exchange/TRANSACTIONS_FETCH'
export const EXCHANGE_TRANSACTIONS = 'exchange/TRANSACTIONS'
export const EXCHANGE_TRANSACTION = 'exchange/TRANSACTION'
export const EXCHANGE_BALANCE_ETH_FETCH = 'exchange/BALANCE_ETH_FETCH'
export const EXCHANGE_BALANCE_ETH = 'exchange/BALANCE_ETH'
export const EXCHANGE_BALANCE_LHT_FETCH = 'exchange/BALANCE_LHT_FETCH'
export const EXCHANGE_BALANCE_LHT = 'exchange/BALANCE_LHT'

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
  dispatch({type: EXCHANGE_BALANCE_ETH_FETCH})
  return ExchangeDAO.getETHBalance()
    .then(balance => dispatch({type: EXCHANGE_BALANCE_ETH, balance}))
}

export const updateExchangeLHTBalance = () => (dispatch) => {
  dispatch({type: EXCHANGE_BALANCE_LHT_FETCH})
  return ExchangeDAO.getLHTBalance()
    .then(balance => dispatch({type: EXCHANGE_BALANCE_LHT, balance}))
}

export const exchangeCurrency = (isBuy, amount, rates: AssetModel) => (dispatch) => {
  let action

  if (isBuy) {
    action = ExchangeDAO.buy(amount, rates.sellPrice())
  } else {
    action = ExchangeDAO.sell(amount, rates.buyPrice())
  }
  return action.then(() => {
    dispatch(updateETHBalance())
    dispatch(updateLHTBalance())
    dispatch(updateExchangeLHTBalance())
    dispatch(updateExchangeETHBalance())
  }).catch((e) => {
    dispatch(showAlertModal({
      title: 'Exchange error',
      message: 'Insufficient funds.'
    }))
    console.error(e)
  })
}
