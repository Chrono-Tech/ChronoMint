/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import {
  BLOCKCHAIN_ETHEREUM,
  WALLET_HD_PATH,
} from '@chronobank/login/network/constants'
import WalletModel from '../../models/wallet/WalletModel'
import { subscribeOnTokens } from '../tokens/actions'
import { formatBalances, getWalletBalances } from '../tokens/utils'
import TokenModel from '../../models/tokens/TokenModel'
import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { getAccount } from '../session/selectors'
import { updateEthMultisigWalletBalance } from '../multisigWallet/actions'
import ethereumDAO from '../../dao/EthereumDAO'
import { getMainEthWallet, getWallets } from './selectors/models'
import { notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/constants'
import { AllowanceCollection } from '../../models'
import { executeTransaction } from '../ethereum/actions'
import {
  WALLETS_SET,
  WALLETS_SET_NAME,
  WALLETS_UPDATE_BALANCE,
  WALLETS_UPDATE_WALLET,
} from './constants'
import { getPersistAccount } from '../persistAccount/selectors'

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
  //TODO refactor DerivedWallets separate for each blockchain
  //dispatch(initDerivedWallets())
}

const initWalletsFromKeys = () => (dispatch, getState) => {
  console.log('Init wallets from keys')
  const state = getState()
  const account = getPersistAccount(state)
  console.log(account)

    const wallet = new WalletModel({
      address: account.decryptedWallet.entry.encrypted[0].address,
      blockchain: 'Ethereum',
      isMain: true,
      walletDerivedPath: account.decryptedWallet.entry.encrypted[0].path 
    })
    console.log(wallet)
    dispatch(setWallet(wallet))
    dispatch(updateWalletBalance({ wallet }))
}

const initDerivedWallets = () => async (dispatch, getState) => {
  const state = getState()
  const account = getAccount(state)
  const wallets = getWallets(state)

  Object.values(wallets).forEach((wallet: WalletModel) => {
    if (wallet.isDerived && !wallet.isMain && isOwner(wallet, account)) {
      dispatch(updateWalletBalance({ wallet }))

    }
  })
}

const updateWalletBalance = ({ wallet }) => async (dispatch) => {
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

export const mainTransfer = (wallet: WalletModel, token: TokenModel, amount: Amount, recipient: string, feeMultiplier: Number = 1) => async (dispatch) => {
  const tokenDAO = tokenService.getDAO(token.id())
  const tx = tokenDAO.transfer(wallet.address, recipient, amount, token) // added token for btc like transfers

  if (tx) {
    console.log(wallet)
    await dispatch(executeTransaction({ tx, options: { feeMultiplier, walletDerivedPath: wallet.walletDerivedPath } }))
  }
}

export const mainApprove = (token: TokenModel, amount: Amount, spender: string, feeMultiplier: Number) => async (dispatch, getState) => {
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

export const mainRevoke = (token: TokenModel, spender: string, feeMultiplier: Number = 1) => async (dispatch, getState) => {
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
export const createNewWallet = ({ name }) => async (dispatch, getState) => {
  const state = getState()
  const signer = getSigner(state)
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

      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      //const newWalletSigner = await SignerMemoryModel.fromDerivedPath({ seed: signer.privateKey, derivedPath })
      //address = newWalletSigner.address

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
