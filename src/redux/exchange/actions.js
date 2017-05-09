import ExchangeDAO from '../../dao/ExchangeDAO'
import web3Provider from '../../network/Web3Provider'
import {
  EXCHANGE_RATES,
  EXCHANGE_RATES_FETCH,
  EXCHANGE_TRANSACTIONS,
  EXCHANGE_TRANSACTIONS_FETCH
} from './reducer'
import converter from '../../utils/converter'
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
    return Promise.all([
      ExchangeDAO.getTransactionsByType('Sell', account, {fromBlock, toBlock}),
      ExchangeDAO.getTransactionsByType('Buy', account, {fromBlock, toBlock})
    ]).then(([txSell, txBuy]) => {
      dispatch({
        type: EXCHANGE_TRANSACTIONS,
        transactions: txSell.merge(txBuy),
        toBlock: fromBlock - 1
      })
    })
  })
}

export const getRates = () => (dispatch) => {
  dispatch({type: EXCHANGE_RATES_FETCH})
  Promise.all([
    ExchangeDAO.getBuyPrice(),
    ExchangeDAO.getSellPrice()
  ]).then(([buyPrice, sellPrice]) => {
    dispatch({
      type: EXCHANGE_RATES,
      rate: new AssetModel({
        title: 'LHT',
        buyPrice: converter.fromWei(buyPrice.toNumber()),
        sellPrice: converter.fromWei(sellPrice.toNumber())
      })
    })
  })
}

export const exchangeCurrency = (isBuy, amount, rates: AssetModel) => (dispatch) => {
  let action
  // if (isBuy) {
  //   action = ExchangeDAO.buy(amount, rates.buyPrice())
  // } else {
  //   action = ExchangeDAO.sell(amount, rates.buyPrice())
  // }
  return ExchangeDAO.buy(amount, rates.sellPrice()).then(result => {
    console.log('--actions#r', result)
  })
}
