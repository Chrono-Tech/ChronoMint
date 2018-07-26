/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  bccProvider,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
  btcProvider,
  btgProvider,
  ltcProvider,
} from '@chronobank/login/network/BitcoinProvider'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import WalletModel from '../../models/wallet/WalletModel'
import { subscribeOnTokens } from '../tokens/actions'
import TokenModel from '../../models/tokens/TokenModel'
import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { BLOCKCHAIN_ETHEREUM } from '../../dao/EthereumDAO'
import { getAccount } from '../session/selectors'
import { DUCK_MULTISIG_WALLET } from '../multisigWallet/actions'
import DerivedWalletModel from '../../models/wallet/DerivedWalletModel'
import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import { EE_MS_WALLET_ADDED } from '../../dao/MultisigWalletsManagerDAO'
import MultisigWalletModel from '../../models/wallet/MultisigWalletModel'
import { ethDAO } from '../../refactor/daos/index'

export const DUCK_WALLETS = 'wallets'
export const WALLETS_SET = 'wallet/set'
export const WALLETS_UPDATE_BALANCE = 'wallet/updateBalance'
export const WALLETS_TWO_FA_CONFIRMED = 'wallet/twoFaConfirmed'
export const WALLETS_UPDATE_WALLET = 'wallet/updateWallet'
export const WALLETS_SET_IS_TIME_REQUIRED = 'wallet/isTimeRequired'

let walletsManagerDAO
const isOwner = (wallet, account) => {
  return wallet.owners().items().filter((owner) => owner.address() === account).length > 0
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
  const { account } = getAccount(getState())
  const wallets = getState().get(DUCK_MULTISIG_WALLET)

  wallets.items().map((wallet: DerivedWalletModel) => {
    const balances = {}
    wallet.balances().items().map((balance) => {
      balances[balance.symbol()] = balance.amount()
    })
    const walletNew = new WalletModel({
      address: wallet.address(),
      blockchain: wallet.blockchain(),
      name: wallet.name(),
      owners: wallet.owners().items().map((ownerModel) => ownerModel.address()),
      balances,
      customTokens: wallet.customTokens(),
      deriveNumber: wallet.deriveNumber(),
      isDerived: true,
    })

    // TODO @abdulov remove this
    dispatch({ type: WALLETS_SET, wallet: walletNew })

    if (wallet.isDerived() && isOwner(wallet, account)) {

      dispatch(updateWalletBalance({ wallet }))

      switch (wallet.blockchain()) {
        case BLOCKCHAIN_BITCOIN:
          btcProvider.createNewChildAddress(wallet.deriveNumber())
          btcProvider.subscribeNewWallet(wallet.address())
          break
        case BLOCKCHAIN_BITCOIN_CASH:
          bccProvider.createNewChildAddress(wallet.deriveNumber())
          bccProvider.subscribeNewWallet(wallet.address())
          break
        case BLOCKCHAIN_BITCOIN_GOLD:
          btgProvider.createNewChildAddress(wallet.deriveNumber())
          btgProvider.subscribeNewWallet(wallet.address())
          break
        case BLOCKCHAIN_LITECOIN:
          ltcProvider.createNewChildAddress(wallet.deriveNumber())
          ltcProvider.subscribeNewWallet(wallet.address())
          break
        case BLOCKCHAIN_ETHEREUM:
          // dispatch(subscribeOnTokens(getTokensBalancesAndWatch(wallet.address(), wallet.blockchain(), wallet.customTokens())))
          break
        default:
      }
    }
  })
}

export const initMultisigWallets = () => async (dispatch) => {

  walletsManagerDAO = await contractsManagerDAO.getWalletsManagerDAO()
  walletsManagerDAO
    .on(EE_MS_WALLET_ADDED, async (walletModel: MultisigWalletModel) => {
      const wallet = new WalletModel({
        address: walletModel.address(),
        blockchain: walletModel.blockchain(),
        name: walletModel.name(),
        owners: walletModel.owners().items().map((ownerModel) => ownerModel.address()),
        isMultisig: true,
      })

      dispatch({ type: WALLETS_SET, wallet })
    })

  // TODO implement this method
  // dispatch(subscribeOnMultisigWalletService())

  // TODO implement this method
  dispatch(check2FAChecked())

  // all ready, start fetching
  walletsManagerDAO.fetchWallets()
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
      dispatch(updateWalletBalance({ wallet }))
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
