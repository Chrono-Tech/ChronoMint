import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import BigNumber from 'bignumber.js'
import { EVENT_APPROVAL_TRANSFER, EVENT_NEW_TRANSFER, EVENT_UPDATE_BALANCE, TXS_PER_PAGE } from 'dao/AbstractTokenDAO'
import assetDonatorDAO from 'dao/AssetDonatorDAO'
import ethereumDAO from 'dao/EthereumDAO'
import Immutable from 'immutable'
import Amount from 'models/Amount'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import BalanceModel from 'models/tokens/BalanceModel'
import TokenModel from 'models/tokens/TokenModel'
import type TxModel from 'models/TxModel'
import AllowanceModel from 'models/wallet/AllowanceModel'
import { addMarketToken } from 'redux/market/action'
import { notify } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import tokenService, { EVENT_NEW_TOKEN } from 'services/TokenService'

export const DUCK_MAIN_WALLET = 'mainWallet'

export const WALLET_BALANCE = 'mainWallet/BALANCE'
export const WALLET_BALANCE_SET = 'mainWallet/BALANCE_SET'
export const WALLET_ALLOWANCE = 'mainWallet/ALLOWANCE'
export const WALLET_BTC_ADDRESS = 'mainWallet/BTC_ADDRESS'
export const WALLET_BCC_ADDRESS = 'mainWallet/BCC_ADDRESS'
export const WALLET_BTG_ADDRESS = 'mainWallet/BTG_ADDRESS'
export const WALLET_LTC_ADDRESS = 'mainWallet/LTC_ADDRESS'
export const WALLET_NEM_ADDRESS = 'mainWallet/NEM_ADDRESS'
export const WALLET_TRANSACTIONS_FETCH = 'mainWallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION = 'mainWallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'mainWallet/TRANSACTIONS'
export const WALLET_IS_TIME_REQUIRED = 'mainWallet/IS_TIME_REQUIRED'
export const WALLET_TOKEN_BALANCE = 'mainWallet/TOKEN_BALANCE'
export const WALLET_INIT = 'mainWallet/INIT'

export const ETH = ethereumDAO.getSymbol()
export const TIME = 'TIME'
export const LHT = 'LHT'

export const setBalance = (token: TokenModel, amount: BigNumber) => ({
  type: WALLET_BALANCE_SET,
  token,
  amount,
})

export const updateBalance = (token: TokenModel, isCredited, amount: BigNumber) => ({
  type: WALLET_BALANCE,
  token,
  isCredited,
  amount,
})

export const balancePlus = (amount: BigNumber, token: TokenModel) => updateBalance(token, true, amount)

export const balanceMinus = (amount: BigNumber, token: TokenModel) => updateBalance(token, false, amount)

export const allowance = (allowance: AllowanceModel) => ({ type: WALLET_ALLOWANCE, allowance })

const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const { account, profile } = getState().get(DUCK_SESSION)
  if (token.isOptional() && !profile.tokens().get(token.id())) {
    return
  }

  const symbol = token.symbol()
  const tokenDAO = tokenService.getDAO(token.id())

  // subscribe
  tokenDAO
    .on(EVENT_NEW_TRANSFER, (tx: TxModel) => {
      dispatch(notify(new TransferNoticeModel({
        value: token.removeDecimals(tx.value()),
        symbol,
        from: tx.from(),
        to: tx.to(),
        credited: tx.isCredited(),
      })))

      // TODO @dkchv: !!!!
      // dispatch(updateBalance(token, tx.isCredited(), tx.value()))

      // add to table
      dispatch({ type: WALLET_TRANSACTION, tx })
    })
    .on(EVENT_UPDATE_BALANCE, ({ balance /* balance3, balance6 */ }) => {
      dispatch(setBalance(token, balance.balance0))
    })
    .on(EVENT_APPROVAL_TRANSFER, ({ spender, value }) => {
      dispatch(notify(new ApprovalNoticeModel({
        value: token.removeDecimals(value),
        symbol,
        spender,
      })))

      dispatch({
        type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
          amount: new Amount(value, token.id()),
          spender,
          token: token.id,
        }),
      })
    })

  await tokenDAO.watch(account)

  const balance = await tokenDAO.getAccountBalance(account)
  dispatch({
    type: WALLET_TOKEN_BALANCE,
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(balance, symbol),
    }),
  })

  dispatch(addMarketToken(token.symbol()))
}

export const initMainWallet = () => (dispatch, getState) => {
  if (getState().get(DUCK_MAIN_WALLET).isInited()) {
    return
  }
  dispatch({ type: WALLET_INIT, isInited: true })

  const callback = (token) => dispatch(handleToken(token))
  tokenService.on(EVENT_NEW_TOKEN, callback)
  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(callback)

  dispatch({ type: WALLET_BTC_ADDRESS, address: btcProvider.getAddress() })
  dispatch({ type: WALLET_BCC_ADDRESS, address: bccProvider.getAddress() })
  dispatch({ type: WALLET_BTG_ADDRESS, address: btgProvider.getAddress() })
  dispatch({ type: WALLET_LTC_ADDRESS, address: ltcProvider.getAddress() })
  dispatch({ type: WALLET_NEM_ADDRESS, address: nemProvider.getAddress() })

  // TODO @dkchv: !!! review again
  // dispatch(getAccountTransactions(tokens.list()))
}

export const mainTransfer = (token: TokenModel, amount: Amount, recipient: string, feeMultiplier: Number = 1) => async () => {
  try {
    const tokenDAO = tokenService.getDAO(token.id())
    await tokenDAO.transfer(recipient, amount, feeMultiplier)
  } catch (e) {
    // eslint-disable-next-line
    console.error('transfer error', e.message)
  }
}

export const mainApprove = (token: TokenModel, amount: Amount, spender: string) => async () => {
  try {
    const tokenDAO = tokenService.getDAO(token)
    await tokenDAO.approve(spender, amount)
  } catch (e) {
    // no rollback
    // eslint-disable-next-line
    console.error('approve error', e.message)
  }
}

export const updateIsTIMERequired = () => async (dispatch) => {
  dispatch({ type: WALLET_IS_TIME_REQUIRED, value: await assetDonatorDAO.isTIMERequired() })
}

export const requireTIME = () => async (dispatch) => {
  try {
    await assetDonatorDAO.requireTIME()
  } catch (e) {
    // no rollback
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
  await dispatch(updateIsTIMERequired())
}

/**
 * LATEST TRANSACTIONS
 */
const getTransferId = 'wallet'
let lastCacheId
let txsCache = []

export const getAccountTransactions = () => async (dispatch, getState) => {
  const tokens = getState().get(DUCK_TOKENS).item()
  dispatch({ type: WALLET_TRANSACTIONS_FETCH })

  const cacheId = Object.values(tokens).map((v: TokenModel) => v.symbol()).join(',')

  const reset = lastCacheId && cacheId !== lastCacheId
  lastCacheId = cacheId
  if (reset) {
    txsCache = []
  }

  let txs = txsCache.slice(0, TXS_PER_PAGE)
  txsCache = txsCache.slice(TXS_PER_PAGE)

  if (txs.length < TXS_PER_PAGE) { // so cache is empty
    const promises = []
    for (let token: TokenModel of tokens) {
      const tokenDAO = tokenService.getDAO(token.id())
      if (reset) {
        tokenDAO.resetFilterCache()
      }
      promises.push(tokenDAO.getTransfer(getTransferId))
    }
    const result = await Promise.all(promises)

    let newTxs = []
    for (let pack of result) {
      newTxs = [ ...newTxs, ...pack ]
    }

    newTxs.sort((a, b) => b.get('time') - a.get('time'))

    txs = [ ...txs, ...newTxs ]
    txsCache = txs.slice(TXS_PER_PAGE)
    txs = txs.slice(0, TXS_PER_PAGE)
  }

  let map = new Immutable.Map()
  for (let tx: TxModel of txs) {
    map = map.set(tx.id(), tx)
  }

  dispatch({ type: WALLET_TRANSACTIONS, map })
}
