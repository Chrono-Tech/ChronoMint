/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  WALLET_HD_PATH,
} from '@chronobank/login/network/constants'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import WalletModel from '../../models/wallet/WalletModel'
import { subscribeOnTokens } from '../tokens/thunks'
import { formatBalances, getWalletBalances } from '../tokens/utils'
import {
  createBitcoinWalletModelFromPK,
  createLitecoinWalletModelFromPK,
  createBitcoinCashWalletModelFromPK,
} from '../bitcoin/utils'
import TokenModel from '../../models/tokens/TokenModel'
import EthereumMemoryDevice  from '../../services/signers/EthereumMemoryDevice'
import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { getAccount } from '../session/selectors'
import { updateEthMultisigWalletBalance } from '../multisigWallet/actions'
import ethereumDAO from '../../dao/EthereumDAO'
import { getMainEthWallet, getWallets } from './selectors/models'
import { notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/constants'
import { AllowanceCollection } from '../../models'
import { executeTransaction } from '../ethereum/thunks'
import { executeBitcoinTransaction } from '../bitcoin/thunks'
import {
  WALLETS_SET,
  WALLETS_SET_NAME,
  WALLETS_UPDATE_BALANCE,
  WALLETS_UPDATE_WALLET,
} from './constants'
import { executeNemTransaction } from '../nem/thunks'
import { getPersistAccount, getEthereumSigner, getSelectedNetwork } from '../persistAccount/selectors'

const isOwner = (wallet, account) => {
  return wallet.owners.includes(account)
}

export const get2FAEncodedKey = (callback) => () => {
  return ethereumProvider.get2FAEncodedKey(callback)
}

export const setWalletName = (walletId, name) => (dispatch) => dispatch({ type: WALLETS_SET_NAME, walletId, name })

export const setWallet = (wallet) => (dispatch) => dispatch({ type: WALLETS_SET, wallet })

export const setWalletBalance = (walletId, balance) => (dispatch) => dispatch({ type: WALLETS_UPDATE_BALANCE, walletId, balance })

export const initWallets = () => (dispatch) => {
  dispatch(initWalletsFromKeys())
  dispatch(initDerivedWallets())
}

const initWalletsFromKeys = () => (dispatch, getState) => {
  const state = getState()
  const account = getPersistAccount(state)
  const network = getSelectedNetwork()(state)
  const wallets = []

  wallets.push(new WalletModel({
    address: account.decryptedWallet.entry.encrypted[0].address,
    blockchain: BLOCKCHAIN_ETHEREUM,
    isMain: true,
    walletDerivedPath: account.decryptedWallet.entry.encrypted[0].path,
  }))

  wallets.push(createBitcoinWalletModelFromPK(account.decryptedWallet.privateKey, bitcoin.networks[network.bitcoin], network.bitcoin))
  wallets.push(createBitcoinCashWalletModelFromPK(account.decryptedWallet.privateKey, bitcoin.networks[network.bitcoinCash]), network.bitcoinCash)
  wallets.push(createLitecoinWalletModelFromPK(account.decryptedWallet.privateKey, bitcoin.networks[network.litecoin]), network.litecoin)

  wallets.forEach((wallet) => {
    dispatch(setWallet(wallet))
    dispatch(updateWalletBalance({ wallet }))
  })
}

const initDerivedWallets = () => async (dispatch, getState) => {
  const state = getState()
  const account = getAccount(state)
  const wallets = getWallets(state)

  Object.values(wallets).forEach((wallet: WalletModel) => {
    if (wallet.isDerived && !wallet.isMain && isOwner(wallet, account)) {
      dispatch(updateWalletBalance({ wallet }))

      switch (wallet.blockchain) {
        case BLOCKCHAIN_BITCOIN:
          btcProvider.createNewChildAddress(wallet.deriveNumber)
          btcProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_BITCOIN_CASH:
          bccProvider.createNewChildAddress(wallet.deriveNumber)
          bccProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_BITCOIN_GOLD:
          btgProvider.createNewChildAddress(wallet.deriveNumber)
          btgProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_LITECOIN:
          ltcProvider.createNewChildAddress(wallet.deriveNumber)
          ltcProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_ETHEREUM:
          break
        default:
      }
    }
  })
}

const fallbackCallback = (wallet) => (dispatch) => {
  const updateBalance = (token: TokenModel) => async () => {
    if (token.blockchain() === wallet.blockchain) {
      const dao = tokenService.getDAO(token)
      const balance = await dao.getAccountBalance(wallet.address)
      if (balance) {
        dispatch(setWalletBalance(wallet.id, new Amount(balance, token.symbol(), true)))
      }
    }
  }
  dispatch(subscribeOnTokens(updateBalance))
}

const updateWalletBalance = ({ wallet }) => async (dispatch) => {
  if (wallet.blockchain === BLOCKCHAIN_NEM) {
    return dispatch(fallbackCallback(wallet))
  }
  getWalletBalances({ wallet })
    .then((balancesResult) => {
      try {
        dispatch(setWallet(new WalletModel({
          ...wallet,
          balances: {
            ...wallet.balances,
            ...formatBalances({ blockchain: wallet.blockchain, balancesResult }),
          },
        })))
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.message)
      }
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log('call balances from middleware is failed', e)
      dispatch(fallbackCallback(wallet))
    })
}

export const subscribeWallet = ({ wallet }) => async (dispatch) => {
  const listener = function (data) {
    const checkedFrom = data.from ? data.from.toLowerCase() === wallet.address.toLowerCase() : false
    const checkedTo = data.to ? data.to.toLowerCase() === wallet.address.toLowerCase() : false
    if (checkedFrom || checkedTo) {
      if (wallet.isMain || wallet.isDerived) {
        dispatch(updateWalletBalance({ wallet }))
      }
      if (wallet.isMultisig) {
        dispatch(updateEthMultisigWalletBalance({ wallet }))
      }
    }
  }
  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      ethereumDAO.on('tx', listener)
      return listener
    default:
      return
  }
}

export const unsubscribeWallet = ({ wallet, listener }) => async (/*dispatch, getState*/) => {
  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      ethereumDAO.removeListener('tx', listener)
      return listener
    default:
      return
  }
}

const updateAllowance = (allowance) => (dispatch, getState) => {
  const wallet = getMainEthWallet(getState())
  if (allowance) {
    dispatch({
      type: WALLETS_UPDATE_WALLET,
      wallet: new WalletModel({
        ...wallet,
        allowances: new AllowanceCollection({
          list: {
            ...wallet.allowances.list,
            [allowance.id()]: allowance,
          },
        }),
      }),
    })
  }
}

export const mainTransfer = (
  wallet: WalletModel,
  token: TokenModel,
  amount: Amount,
  recipient: string,
  feeMultiplier: number = 1,
  advancedParams = null,
) => async (dispatch) => {
  try {
    const tokenDAO = tokenService.getDAO(token.id())
    const tx = tokenDAO.transfer(wallet.address, recipient, amount)
    const executeMap = {
      [BLOCKCHAIN_ETHEREUM]: executeTransaction,
      [BLOCKCHAIN_NEM]: executeNemTransaction,
      [BLOCKCHAIN_BITCOIN]: executeBitcoinTransaction,
    }

    // execute
    dispatch(executeMap[wallet.blockchain]({
      tx,
      options: {
        feeMultiplier,
        walletDerivedPath: wallet.derivedPath,
        symbol: token.symbol(),
        ...advancedParams,
      },
    }))

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyError(e))
  }
}

export const mainApprove = (token: TokenModel, amount: Amount, spender: string, feeMultiplier: number) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getMainEthWallet(state)
  const allowance = wallet.allowances.list[`${spender}-${token.id()}`]
  const { account } = state.get(DUCK_SESSION)

  try {
    allowance && dispatch(updateAllowance(allowance.isFetching(true)))
    const tokenDAO = tokenService.getDAO(token)
    const tx = tokenDAO.approve(spender, amount, account)
    if (tx) {
      await dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
    }
  } catch (e) {
    dispatch(notifyError(e, 'mainApprove'))
    allowance && dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

export const mainRevoke = (token: TokenModel, spender: string, feeMultiplier: number = 1) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getMainEthWallet(state)
  const allowance = wallet.allowances.list[`${spender}-${token.id()}`]
  dispatch(updateAllowance(allowance.isFetching(true)))

  const { account } = state.get(DUCK_SESSION)
  try {
    dispatch(updateAllowance(allowance.isFetching(true)))
    const tokenDAO = tokenService.getDAO(token)
    const tx = tokenDAO.revoke(spender, token.symbol(), account)
    if (tx) {
      await dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
    }
  } catch (e) {
    dispatch(notifyError(e, 'mainRevoke'))
    dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

// eslint-disable-next-line complexity
export const createNewChildAddress = ({ blockchain, tokens, name, deriveNumber }) => async (dispatch, getState) => {
  const state = getState()
  const signer = getEthereumSigner(state)
  const account = getState().get(DUCK_SESSION).account
  const wallets = getWallets(state)

  const lastDeriveNumbers = {}
  Object.values(wallets)
    .forEach((wallet) => {
      if (wallet.derivedPath && isOwner(wallet, account)) {
        if (!lastDeriveNumbers[wallet.blockchain()] || (lastDeriveNumbers[wallet.blockchain()] && lastDeriveNumbers[wallet.blockchain()] < wallet.deriveNumber)) {
          lastDeriveNumbers[wallet.blockchain()] = wallet.deriveNumber
        }
      }
    })

  let newDeriveNumber = deriveNumber
  let derivedPath
  let newWallet
  let address

  switch (blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      const newWalletSigner = await EthereumMemoryDevice.getDerivedWallet(signer.privateKey, derivedPath)
      address = newWalletSigner.address
      break

    case BLOCKCHAIN_BITCOIN:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      newWallet = btcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      btcProvider.subscribeNewWallet(address)
      break

    case BLOCKCHAIN_LITECOIN:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      newWallet = ltcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      ltcProvider.subscribeNewWallet(address)
      break

    case BLOCKCHAIN_BITCOIN_GOLD:
    case BLOCKCHAIN_NEM:
    case BLOCKCHAIN_WAVES:
    default:
      return null
  }

  const wallet = new WalletModel({
    name,
    address,
    owners: [account],
    isFetched: true,
    deriveNumber: newDeriveNumber,
    derivedPath,
    blockchain,
    customTokens: tokens,
    isDerived: true,
  })

  dispatch(setWallet(wallet))
  dispatch(updateWalletBalance({ wallet }))
}
