import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import BigNumber from 'bignumber.js'
import { TXS_PER_PAGE } from 'dao/AbstractTokenDAO'
import assetDonatorDAO from 'dao/AssetDonatorDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'
import Immutable from 'immutable'
import Amount from 'models/Amount'
import ApprovalNoticeModel from 'models/notices/ApprovalNoticeModel'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import type ProfileModel from 'models/ProfileModel'
import BalanceModel from 'models/tokens/BalanceModel'
import TokenModel from 'models/tokens/TokenModel'
import type TxModel from 'models/TxModel'
import { notify } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import tokenService, { EVENT_NEW_TOKEN } from 'services/TokenService'
import { addMarketToken } from 'redux/market/action'
import { DUCK_TOKENS } from 'redux/tokens/actions'

export const DUCK_MAIN_WALLET = 'mainWallet'

export const WALLET_TOKENS_FETCH = 'mainWallet/TOKENS_FETCH'
export const WALLET_TOKENS = 'mainWallet/TOKENS'
export const WALLET_BALANCE = 'mainWallet/BALANCE'
export const WALLET_BALANCE_SET = 'mainWallet/BALANCE_SET'
export const WALLET_ALLOWANCE = 'mainWallet/ALLOWANCE'
export const WALLET_TIME_DEPOSIT = 'mainWallet/TIME_DEPOSIT'
export const WALLET_TIME_ADDRESS = 'mainWallet/TIME_ADDRESS'
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

export const updateDeposit = (amount: BigNumber, isCredited: ?boolean) => ({
  type: WALLET_TIME_DEPOSIT,
  isCredited,
  amount,
})

export const depositPlus = (amount: BigNumber) => updateDeposit(amount, true)

export const depositMinus = (amount: BigNumber) => updateDeposit(amount, false)

export const allowance = (token: TokenModel, value: BigNumber, spender) => ({
  type: WALLET_ALLOWANCE,
  token,
  value,
  spender,
})

export const watchTransfer = (notice: TransferNoticeModel) => async (dispatch, getState) => {
  const tx: TxModel = notice.tx()
  const token: TokenModel = getState().get(DUCK_TOKENS).get(tx.symbol())

  dispatch(updateBalance(token, tx.isCredited(), tx.value()))

  const timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
  const timeHolderWalletAddress = await timeHolderDAO.getWalletAddress()
  let updateTIMEAllowance = false
  if (tx.to() === timeHolderWalletAddress) {
    dispatch(depositPlus(tx.value()))
    updateTIMEAllowance = true
  } else if (tx.from() === timeHolderWalletAddress) {
    dispatch(depositMinus(tx.value()))
    updateTIMEAllowance = true
  }
  if (updateTIMEAllowance) {
    const dao = await token.dao()
    dispatch(allowance(token, await dao.getAccountAllowance(timeHolderWalletAddress), timeHolderWalletAddress))
  }

  dispatch(notify(notice))
  dispatch({ type: WALLET_TRANSACTION, tx })
}

export const watchBalance = ({ symbol, balance /* balance3, balance6 */ }) => async (dispatch, getState) => {
  const token: TokenModel = getState().get(DUCK_MAIN_WALLET).tokens().get(symbol)
  dispatch(setBalance(token, balance))
}

const fetchTokenBalance = (token: TokenModel) => async (dispatch, getState) => {
  const { account, profile } = getState().get(DUCK_SESSION)
  if (token.isOptional() && !profile.tokens().get(token.id())) {
    return
  }
  const symbol = token.symbol()

  // set placeholder
  dispatch({
    type: WALLET_TOKEN_BALANCE,
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(0, symbol, false),
    }),
  })

  // fetch actual
  const tokenDAO = tokenService.getDAO(token)
  const balance = await tokenDAO.getAccountBalance(account)
  dispatch({
    type: WALLET_TOKEN_BALANCE,
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(balance, symbol),
    }),
  })
}

export const initMainWallet = () => (dispatch, getState) => {
  const callback = (token) => dispatch(fetchTokenBalance(token))
  tokenService.on(EVENT_NEW_TOKEN, callback)

  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(callback)
}

export const watchInitWallet = () => async (dispatch, getState) => {
  return
  const state = getState()

  const profile: ProfileModel = state.get(DUCK_SESSION).profile
  const previous = state.get(DUCK_MAIN_WALLET).tokens()

  dispatch({ type: WALLET_TOKENS_FETCH })
  // const dao = await contractsManagerDAO.getERC20ManagerDAO()
  // let tokens = await dao.getUserTokens(profile.tokens().toArray())
  let tokens = state.get(DUCK_TOKENS)
  // dispatch({ type: WALLET_TOKENS, tokens })
  dispatch(getAccountTransactions(tokens.list()))

  // const toStopArray = previous.filter((k) => !tokens.get(k)).valueSeq().toArray().map((token: TokenModel) => {
    // const dao = token.dao()
    // return dao.stopWatching()
  // })
  // if (toStopArray.length) {
  //   await Promise.all(toStopArray)
  // }

  const timeHolderDAO = await contractsManagerDAO.getTIMEHolderDAO()
  const [ timeHolderAddress, timeHolderWalletAddress ] = await Promise.all([
    timeHolderDAO.getAddress(),
    timeHolderDAO.getWalletAddress(),
  ])

  let contractNames = {}
  contractNames[ timeHolderAddress ] = TIME + ' Holder'
  ApprovalNoticeModel.setContractNames(contractNames)
  dispatch({ type: WALLET_TIME_ADDRESS, address: timeHolderWalletAddress })

  // NOTE @ipavlenko: BCC and BTC addresses usually the same.
  // Decided to manage them independently to simplify further works on multiple wallets. .
  dispatch({ type: WALLET_BTC_ADDRESS, address: btcProvider.getAddress() })
  dispatch({ type: WALLET_BCC_ADDRESS, address: bccProvider.getAddress() })
  dispatch({ type: WALLET_BTG_ADDRESS, address: btgProvider.getAddress() })
  dispatch({ type: WALLET_LTC_ADDRESS, address: ltcProvider.getAddress() })
  dispatch({ type: WALLET_NEM_ADDRESS, address: nemProvider.getAddress() })

  tokens = tokens.filter((k) => !previous.get(k)).valueSeq().toArray()
  for (let token: TokenModel of tokens) {
    dispatch(addMarketToken(token.symbol()))
    const dao = token.dao()
    await dao.watchTransfer((notice) => dispatch(watchTransfer(notice)))
    if (dao.watchBalance) {
      await dao.watchBalance((balance) => dispatch(watchBalance(balance)))
    }
    await dao.watchApproval((notice: ApprovalNoticeModel) => {
      dispatch({ type: WALLET_ALLOWANCE, token, value: notice.value(), spender: notice.spender() })
      dispatch(notify(notice.setToken(token)))
    })
  }
}

export const mainTransfer = (token: TokenModel, amount: Amount, recipient: string, feeMultiplier: Number = 1) => async (dispatch) => {
  try {
    const tokenDAO = tokenService.getDAO(token)
    await tokenDAO.transfer(recipient, amount, feeMultiplier)
  } catch (e) {
    // eslint-disable-next-line
    console.error('transfer error', e.message)
  }
}

export const mainApprove = (token: TokenModel, amount: Number, spender: string) => async () => {
  try {
    const amountBN = new BigNumber(amount)
    const dao = await token.dao()
    await dao.approve(spender, amountBN)
  } catch (e) {
    // no rollback
    // eslint-disable-next-line
    console.error('approve error', e.message)
  }
}

export const depositTIME = (amount: string) => async (dispatch, getState) => {
  const amountBN = new BigNumber(amount)
  const token: TokenModel = getState().get(DUCK_MAIN_WALLET).tokens().get(TIME)

  dispatch(balanceMinus(amountBN, token))

  try {
    const dao = await contractsManagerDAO.getTIMEHolderDAO()
    await dao.deposit(amountBN)
  } finally {
    // compensation for update in watchTransfer
    dispatch(balancePlus(amountBN, token))
  }
}

export const withdrawTIME = (amount: string) => async (dispatch) => {
  const amountBN = new BigNumber(amount)

  dispatch(depositMinus(amountBN))

  try {
    const dao = await contractsManagerDAO.getTIMEHolderDAO()
    await dao.withdraw(amountBN)
  } finally {
    dispatch(depositPlus(amountBN))
  }
}

export const initTIMEDeposit = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getTIMEHolderDAO()
  const deposit = await dao.getAccountDepositBalance()
  dispatch(updateDeposit(deposit, null))
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

export const getAccountTransactions = (tokens) => async (dispatch) => {
  dispatch({ type: WALLET_TRANSACTIONS_FETCH })

  const tokensLocal = tokens.valueSeq().toArray()

  const cacheId = Object.values(tokensLocal).map((v: TokenModel) => v.symbol()).join(',')

  const reset = lastCacheId && cacheId !== lastCacheId
  lastCacheId = cacheId
  if (reset) {
    txsCache = []
  }

  let txs = txsCache.slice(0, TXS_PER_PAGE)
  txsCache = txsCache.slice(TXS_PER_PAGE)

  if (txs.length < TXS_PER_PAGE) { // so cache is empty
    const promises = []
    for (let token: TokenModel of tokensLocal) {
      if (reset) {
        token.dao().resetFilterCache()
      }
      promises.push(token.dao().getTransfer(getTransferId))
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
