import DAORegistry from '../../dao/DAORegistry'
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
  }).then(async (resolvedBlock) => {
    const fromBlock = Math.max(resolvedBlock - 100, 1)
    const dao = await DAORegistry.getExchangeDAO()
    return dao.getTransactions(fromBlock, toBlock).then(transactions => {
      dispatch({
        type: EXCHANGE_TRANSACTIONS,
        transactions,
        toBlock: fromBlock - 1
      })
    })
  })
}

export const getRates = () => async (dispatch) => {
  dispatch({type: EXCHANGE_RATES_FETCH})
  const dao = await DAORegistry.getExchangeDAO()
  return dao.getRates().then((rate: AssetModel) => {
    dispatch({
      type: EXCHANGE_RATES,
      rate
    })
  })
}

export const updateExchangeETHBalance = () => async (dispatch) => {
  dispatch({type: EXCHANGE_BALANCE_ETH_FETCH})
  const dao = await DAORegistry.getExchangeDAO()
  return dao.getETHBalance()
    .then(balance => dispatch({type: EXCHANGE_BALANCE_ETH, balance}))
}

export const updateExchangeLHTBalance = () => async (dispatch) => {
  dispatch({type: EXCHANGE_BALANCE_LHT_FETCH})
  const dao = await DAORegistry.getExchangeDAO()
  return dao.getLHTBalance()
    .then(balance => dispatch({type: EXCHANGE_BALANCE_LHT, balance}))
}

export const exchangeCurrency = (isBuy, amount, rates: AssetModel) => async (dispatch) => {
  let action
  const dao = await DAORegistry.getExchangeDAO()
  if (isBuy) {
    action = dao.buy(amount, rates.sellPrice())
  } else {
    action = dao.sell(amount, rates.buyPrice())
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
