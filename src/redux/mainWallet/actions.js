import validator from 'models/validator'
import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import BigNumber from 'bignumber.js'
import { EVENT_APPROVAL_TRANSFER, EVENT_NEW_TRANSFER, EVENT_UPDATE_BALANCE } from 'dao/AbstractTokenDAO'
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
import { TXS_PER_PAGE } from 'models/wallet/TransactionsCollection'
import { addMarketToken } from 'redux/market/action'
import { notify } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS, subscribeOnTokens } from 'redux/tokens/actions'
import tokenService from 'services/TokenService'
import AddressModel from 'models/wallet/AddressModel'
import MainWalletModel from 'models/wallet/MainWalletModel'

export const DUCK_MAIN_WALLET = 'mainWallet'

export const WALLET_BALANCE = 'mainWallet/BALANCE'
export const WALLET_BALANCE_SET = 'mainWallet/BALANCE_SET'
export const WALLET_ALLOWANCE = 'mainWallet/ALLOWANCE'
export const WALLET_ADDRESS = 'mainWallet/WALLET_ADDRESS'
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
  if (token.isOptional() && !profile.tokens().get(token.address())) {
    return
  }

  const symbol = token.symbol()
  const tokenDAO = tokenService.getDAO(token.id())

  // subscribe
  tokenDAO
    .on(EVENT_NEW_TRANSFER, (tx: TxModel) => {
      // TODO @dkchv: will be moved to notifications
      dispatch(notify(new TransferNoticeModel({
        value: token.removeDecimals(tx.value()),
        symbol,
        from: tx.from(),
        to: tx.to(),
        credited: tx.isCredited(),
      })))

      // add to table
      // TODO @dkchv: !!! restore after fix
      dispatch({ type: WALLET_TRANSACTION, tx })
      if (!(tx.from() === account || tx.to() === account)) {
        return
      }
      // update balance
      dispatch(fetchTokenBalance(token))
      // update donator
      if (tx.from() === assetDonatorDAO.getInitAddress()) {
        dispatch(updateIsTIMERequired())
      }
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
          token: token.id(),
        }),
      })
    })

  await tokenDAO.watch(account)

  dispatch(fetchTokenBalance(token))
  dispatch(addMarketToken(token.symbol()))

  if (token.symbol() === 'TIME') {
    dispatch(updateIsTIMERequired())
  }
}

const fetchTokenBalance = (token: TokenModel) => async (dispatch, getState) => {
  const tokenDAO = tokenService.getDAO(token.id())
  const { account } = getState().get(DUCK_SESSION)
  const balance = await tokenDAO.getAccountBalance(account)
  dispatch({
    type: WALLET_TOKEN_BALANCE,
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(balance, token.symbol()),
    }),
  })
}

export const initMainWallet = () => async (dispatch, getState) => {
  if (getState().get(DUCK_MAIN_WALLET).isInited()) {
    return
  }
  dispatch({ type: WALLET_INIT, isInited: true })

  dispatch(subscribeOnTokens(handleToken))

  const providers = [
    bccProvider,
    btgProvider,
    ltcProvider,
    btcProvider,
    nemProvider,
    ethereumProvider,
  ]
  providers.map((provider) => {
    dispatch({
      type: WALLET_ADDRESS, address: new AddressModel({
        id: provider.id(),
        address: provider.getAddress(),
      }),
    })
  })

  // TODO @dkchv: !!! review again
  dispatch(getAccountTransactions())
}

export const mainTransfer = (token: TokenModel, amount: Amount, recipient: string, feeMultiplier: Number = 1) => async (dispatch, getState) => {
  try {
    const wallet: MainWalletModel = getState().get(DUCK_MAIN_WALLET)
    const tokenDAO = tokenService.getDAO(token.id())
    await tokenDAO.transfer(wallet.addresses(token.blockchain()).address(), recipient, amount, token, feeMultiplier)
  } catch (e) {
    // eslint-disable-next-line
    console.error('transfer error', e.message)
  }
}

export const mainApprove = (token: TokenModel, amount: Amount, spender: string) => async (dispatch, getState) => {
  const currentAllowance = getState().get(DUCK_MAIN_WALLET).allowances().item(spender, token.id())
  try {
    dispatch({
      type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
        amount,
        spender: spender, //address
        token: token.id(), // id
      }).isFetching(true),
    })
    const tokenDAO = tokenService.getDAO(token)
    await tokenDAO.approve(spender, amount)
  } catch (e) {
    dispatch({ type: WALLET_ALLOWANCE, allowance: currentAllowance })
    // no rollback
    // eslint-disable-next-line
    console.error('approve error', e.message)
  }
}

export const updateIsTIMERequired = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  try {
    dispatch({ type: WALLET_IS_TIME_REQUIRED, value: await assetDonatorDAO.isTIMERequired(account) })
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
}

export const requireTIME = () => async () => {
  try {
    await assetDonatorDAO.requireTIME()
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
}

/**
 * LATEST TRANSACTIONS
 */
const getTransferId = 'wallet'
let lastCacheId
let txsCache = []

export const getAccountTransactions = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const tokens = getState().get(DUCK_TOKENS).items()
  dispatch({ type: WALLET_TRANSACTIONS_FETCH })

  const cacheId = tokens.map((v: TokenModel) => v.symbol()).join(',')

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
      promises.push(tokenDAO.getTransfer(getTransferId, account))
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

export const getSpendersAllowance = (tokenId: string, spender: string) => async (dispatch, getState) => {
  if (validator.address(spender) !== null || !tokenId) {
    return null
  }
  const { account } = getState().get(DUCK_SESSION)
  const dao = tokenService.getDAO(tokenId)
  const allowance = await dao.getAccountAllowance(account, spender)
  dispatch({
    type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
      amount: new Amount(allowance, tokenId),
      spender, //address
      token: tokenId, // id
    }),
  })
}
