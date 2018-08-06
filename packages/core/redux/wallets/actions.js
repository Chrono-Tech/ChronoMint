/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
  WALLET_HD_PATH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from '@chronobank/login/network/constants'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import WalletModel from '../../models/wallet/WalletModel'
import { subscribeOnTokens } from '../tokens/actions'
import TokenModel from '../../models/tokens/TokenModel'
import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { getAccount } from '../session/selectors'
import { updateEthMultisigWalletBalance } from '../multisigWallet/actions'
import ethDAO from '../../dao/ETHDAO'
import { getMainEthWallet, getWallets } from './selectors/models'
import { notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/constants'
import { AllowanceCollection, SignerMemoryModel } from '../../models'
import { executeTransaction } from '../ethereum/actions'
import { WALLETS_SET, WALLETS_TWO_FA_CONFIRMED, WALLETS_UPDATE_BALANCE, WALLETS_UPDATE_WALLET } from './constants'
import { getSigner } from '../persistAccount/selectors'

const isOwner = (wallet, account) => {
  return wallet.owners.includes(account)
}

export const get2FAEncodedKey = (callback) => () => {
  return ethereumProvider.get2FAEncodedKey(callback)
}

export const check2FAChecked = () => async (dispatch) => {
  const result = await dispatch(get2FAEncodedKey())
  let twoFAConfirmed
  if (typeof result === 'object' && result.code) {
    twoFAConfirmed = true
  } else {
    twoFAConfirmed = false
  }
  dispatch({ type: WALLETS_TWO_FA_CONFIRMED, twoFAConfirmed })
}

export const initWallets = () => (dispatch) => {
  dispatch(initWalletsFromKeys())
  dispatch(initDerivedWallets())
}

const initWalletsFromKeys = () => (dispatch) => {
  const providers = [
    bccProvider,
    btgProvider,
    ltcProvider,
    btcProvider,
    nemProvider,
    wavesProvider,
    ethereumProvider,
  ]

  providers.map((provider) => {
    const wallet = new WalletModel({
      address: provider.getAddress(),
      blockchain: provider.id(),
      isMain: true,
    })

    dispatch({ type: WALLETS_SET, wallet })
    dispatch(updateWalletBalance({ wallet }))
  })
}

const initDerivedWallets = () => async (dispatch, getState) => {
  const state = getState()
  const account = getAccount(state)
  const wallets = getWallets(state)

  Object.values(wallets).map((wallet: WalletModel) => {
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

const updateWalletBalance = ({ wallet }) => async (dispatch) => {
  const updateBalance = (token: TokenModel) => async () => {
    if (token.blockchain() === wallet.blockchain) {
      const dao = tokenService.getDAO(token)
      let balance = await dao.getAccountBalance(wallet.address)
      if (balance) {
        await dispatch({
          type: WALLETS_UPDATE_BALANCE,
          walletId: wallet.id,
          balance: new Amount(balance, token.symbol(), true),
        })
      }
    }
  }

  dispatch(subscribeOnTokens(updateBalance))
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
      ethDAO.on('tx', listener)
      return listener
    default:
      return
  }

}

export const unsubscribeWallet = ({ wallet, listener }) => async (/*dispatch, getState*/) => {
  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      ethDAO.removeListener('tx', listener)
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
  const tx = tokenDAO.transfer(wallet.address, recipient, amount)

  if (tx) {
    await dispatch(executeTransaction({ tx, options: { feeMultiplier, walletDerivedPath: wallet.derivedPath } }))
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
    // eslint-disable-next-line
    console.log('mainRevoke approve: ', e)
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
    // eslint-disable-next-line
    console.log('mainRevoke error: ', e)
    dispatch(notifyError(e, 'mainRevoke'))
    dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

export const createNewChildAddress = ({ blockchain, tokens, name, deriveNumber }) => async (dispatch, getState) => {
  const state = getState()
  const signer = getSigner(state)
  const account = getState().get(DUCK_SESSION).account
  const wallets = getWallets(state)

  let lastDeriveNumbers = {}
  Object.values(wallets)
    .map((wallet) => {
      if (wallet.derivedPath && isOwner(wallet, account)) {
        if (!lastDeriveNumbers[wallet.blockchain()] || (lastDeriveNumbers[wallet.blockchain()] && lastDeriveNumbers[wallet.blockchain()] < wallet.deriveNumber)) {
          lastDeriveNumbers[wallet.blockchain()] = wallet.deriveNumber
        }
      }
    })

  let wallet
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
      const newWalletSigner = await SignerMemoryModel.fromDerivedPath({ seed: signer.privateKey, derivedPath })
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

  wallet = new WalletModel({
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

  dispatch({ type: WALLETS_SET, wallet })
  dispatch(updateWalletBalance({ wallet }))
}
