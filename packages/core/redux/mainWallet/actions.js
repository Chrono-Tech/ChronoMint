/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// FIXME: to rework all methods below to avoid complexity
/* eslint-disable complexity */

import { getDeriveWalletsAddresses, getMultisigWallets } from '../wallet/selectors'
import Amount from '../../models/Amount'
import ApprovalNoticeModel from '../../models/notices/ApprovalNoticeModel'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import BalanceModel from '../../models/tokens/BalanceModel'
import TokenModel from '../../models/tokens/TokenModel'
import validator from '../../models/validator'
import AllowanceModel from '../../models/wallet/AllowanceModel'
import { addMarketToken } from '../market/actions'
import { notify } from '../notifier/actions'
import { DUCK_SESSION } from '../session/constants'
import { subscribeOnTokens } from '../tokens/thunks'
import tokenService from '../../services/TokenService'
import DerivedWalletModel from '../../models/wallet/DerivedWalletModel'
import type TxModel from '../../models/TxModel'
import { getMainAddresses, getMainEthWallet, getMainWalletForBlockchain, getWallet } from '../wallets/selectors/models'
import { daoByType } from '../daos/selectors'
import { estimateGas, executeTransaction } from '../ethereum/thunks'
import { ASSET_DEPOSIT_WITHDRAW, TX_DEPOSIT } from '../../dao/constants/AssetHolderDAO'
import { TX_APPROVE } from '../../dao/constants/ERC20DAO'
import { DUCK_ETH_MULTISIG_WALLET, ETH_MULTISIG_BALANCE, ETH_MULTISIG_FETCHED } from '../multisigWallet/constants'
import { WALLETS_SET_IS_TIME_REQUIRED, WALLETS_UPDATE_BALANCE } from '../wallets/constants'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  ETH,
  EVENT_APPROVAL_TRANSFER,
  EVENT_NEW_TRANSFER,
  EVENT_UPDATE_BALANCE,
  EVENT_UPDATE_TRANSACTION,
  TIME,
} from '../../dao/constants'
import {
  WALLET_ALLOWANCE,
  WALLET_ESTIMATE_GAS_FOR_DEPOSIT,
  WALLET_INIT,
  WALLET_TOKEN_BALANCE,
  WALLET_TRANSACTION,
  WALLET_TRANSACTION_UPDATED,
} from './constants'
import { getTransactionsForMainWallet } from '../wallets/actions'

const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)

  const symbol = token.symbol()
  const tokenDAO = tokenService.getDAO(token.id())

  // subscribe
  tokenDAO
    .on(EVENT_NEW_TRANSFER, (tx: TxModel) => {
      const walletsAccounts = getDeriveWalletsAddresses(getState(), token.blockchain())
      const mainWalletAddresses = getMainAddresses(getState())
      const assetDonatorDAO = daoByType('AssetDonator')(getState())

      const isMainWalletFrom = tx.from().split(',').some((from) => mainWalletAddresses.includes(from))
      const isMainWalletTo = tx.to().split(',').some((to) => mainWalletAddresses.includes(to))
      const isMultiSigWalletsFrom = tx.from().split(',').some((from) => walletsAccounts.includes(from))
      const isMultiSigWalletsTo = tx.to().split(',').some((to) => walletsAccounts.includes(to))

      if (isMainWalletFrom || isMainWalletTo || isMultiSigWalletsFrom || isMultiSigWalletsTo || tx.from() === account || tx.to() === account) {
        if (mainWalletAddresses.includes(tx.from()) || mainWalletAddresses.includes(tx.to()) ||
          walletsAccounts.includes(tx.from()) || walletsAccounts.includes(tx.to()) ||
          tx.from() === account || tx.to() === account) {
          dispatch(notify(new TransferNoticeModel({
            amount: token.removeDecimals(tx.value()),
            symbol,
            from: tx.from(),
            to: tx.to(),
          })))
        }

        if (isMainWalletFrom || isMainWalletTo || tx.from() === account || tx.to() === account) { // for main wallet
          // add to table
          // TODO @dkchv: !!! restore after fix
          dispatch({ type: WALLET_TRANSACTION, tx })

          if (!(tx.from() === account || tx.to() === account)) {
            return
          }

          // update donator
          if (tx.from() === assetDonatorDAO.getInitAddress()) {
            dispatch(updateIsTIMERequired())
          }
        }

        if (walletsAccounts.includes(tx.from()) || walletsAccounts.includes(tx.to())) { // for derive wallets
          const setDerivedWalletBalance = async (wallet: DerivedWalletModel) => {

            dispatch({ type: ETH_MULTISIG_FETCHED, wallet: wallet.set('transactions', wallet.transactions().add(tx)) })

            const dao = tokenService.getDAO(token)
            const balance = await dao.getAccountBalance(wallet.address())
            dispatch({
              type: ETH_MULTISIG_BALANCE,
              walletId: wallet.address(),
              balance: new BalanceModel({
                id: token.id(),
                amount: new Amount(balance, token.symbol(), true),
              }),
            })
          }

          const walletFrom = getState().get(DUCK_ETH_MULTISIG_WALLET).item(tx.from())
          if (walletFrom && walletFrom.isFetched()) {
            setDerivedWalletBalance(walletFrom)
          }
          const walletTo = getMultisigWallets(getState()).item(tx.to())
          if (walletTo && walletTo.isFetched()) {
            setDerivedWalletBalance(walletTo)
          }
        }
      }
    })
    .on(EVENT_UPDATE_BALANCE, ({ account, balance }) => {

      switch (token.blockchain()) {
        case BLOCKCHAIN_ETHEREUM:
          const wallets = getState().get(DUCK_ETH_MULTISIG_WALLET)
          if (wallets.item(account)) {
            dispatch({
              type: ETH_MULTISIG_BALANCE,
              walletId: account,
              balance: new BalanceModel({
                id: token.id(),
                amount: new Amount(balance, token.symbol(), true),
              }),
            })
          } else {
            const addresses = getMainEthWallet(getState())
            if (addresses.includes(account)) {
              dispatch({
                type: WALLET_TOKEN_BALANCE,
                balance: new BalanceModel({
                  id: token.id(),
                  amount: new Amount(balance, token.symbol()),
                }),
              })
            }
          }
          break

        case BLOCKCHAIN_NEM:
        case BLOCKCHAIN_BITCOIN:
        case BLOCKCHAIN_BITCOIN_CASH:
        case BLOCKCHAIN_DASH:
        case BLOCKCHAIN_LITECOIN:
        case BLOCKCHAIN_WAVES:
          const wallet = getWallet(token.blockchain(), account)(getState())
          dispatch({ type: WALLETS_UPDATE_BALANCE, walletId: wallet.id, balance: new Amount(balance, token.symbol()) })
          break

        default:
          //eslint-disable-next-line no-console
          console.warn('Update balance of unknown token blockchain: ', account, balance, token.toJSON())
          break
      }
    })
    .on(EVENT_APPROVAL_TRANSFER, ({ spender, value }) => {
      dispatch(notify(new ApprovalNoticeModel({
        amount: token.removeDecimals(value),
        symbol,
        spender,
      })))

      dispatch({
        type: WALLET_ALLOWANCE, allowance: new AllowanceModel({
          amount: new Amount(value, token.id()),
          spender,
          token: token.id(),
          isFetching: false,
          isFetched: true,
        }),
      })
    })
    .on(EVENT_UPDATE_TRANSACTION, ({ tx }) => {
      dispatch({
        type: WALLET_TRANSACTION_UPDATED,
        tx,
      })
    })

  dispatch(addMarketToken(token.symbol()))

  if (token.symbol() === 'TIME') {
    dispatch(updateIsTIMERequired())
  }

  // loading transaction for Current transaction list
  if (token.blockchain() && !token.isERC20()) {
    const wallet = getMainWalletForBlockchain(token.blockchain())(getState())
    if (wallet && wallet.address) {
      dispatch(getTransactionsForMainWallet({
        wallet,
        address: wallet.address,
        blockchain: token.blockchain(),
        forcedOffset: true,
      }))
    }
  }
}

export const fetchTokenBalance = (token: TokenModel, account) => async (dispatch) => {
  const tokenDAO = tokenService.getDAO(token.id())
  const balance = await tokenDAO.getAccountBalance(token.blockchain() === BLOCKCHAIN_ETHEREUM ? account : null)
  dispatch({
    type: WALLET_TOKEN_BALANCE,
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(balance, token.symbol()),
    }),
  })
}

export const initMainWallet = () => async (dispatch) => {
  dispatch({ type: WALLET_INIT, isInited: true })

  dispatch(subscribeOnTokens(handleToken))
}

export const updateIsTIMERequired = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const wallet = getMainEthWallet(getState())
  try {
    const assetDonatorDAO = daoByType('AssetDonator')(getState())
    const isTIMERequired = await assetDonatorDAO.isTIMERequired(account)
    dispatch({
      type: WALLETS_SET_IS_TIME_REQUIRED,
      walletId: wallet.id,
      isTIMERequired,
    })
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
}

export const requireTIME = () => async (dispatch, getState) => {
  try {
    const state = getState()
    const assetDonatorDAO = daoByType('AssetDonator')(state)

    const tx = await assetDonatorDAO.requireTIME()

    if (tx) {
      await dispatch(executeTransaction({ tx }))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
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
      isFetching: false,
      isFetched: true,
    }),
  })
}

export const estimateGasForDeposit = (mode: string, params, callback, gasPriceMultiplier = 1) => async (dispatch, getState) => {
  let dao
  let tx
  switch (mode) {
    case TX_APPROVE:
      dao = await tokenService.getDAO(TIME)
      tx = dao[TX_APPROVE](...params)
      break
    case TX_DEPOSIT:
    case ASSET_DEPOSIT_WITHDRAW:
      dao = daoByType('TimeHolder')(getState())
      tx = dao[mode](...params)
      break
  }
  try {
    const { gasLimit, gasFee, gasPrice } = await dispatch(estimateGas(tx))
    callback(null, {
      gasLimit,
      gasFee: new Amount(gasFee.mul(gasPriceMultiplier), ETH),
      gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier), ETH),
    })
  } catch (e) {
    callback(e)
  }
  dispatch({ type: WALLET_ESTIMATE_GAS_FOR_DEPOSIT })
}

export const getTokensBalancesAndWatch = (address, blockchain, customTokens: Array<string>) => (token) => async (/*dispatch*/) => {
  if (blockchain !== token.blockchain() || (token.symbol() !== ETH && customTokens && !customTokens.includes(token.symbol()))) {
    return null
  }
  // const dao = tokenService.getDAO(token)
  // await dao.watch(address)
}
