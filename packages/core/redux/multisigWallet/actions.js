/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import type MultisigWalletDAO from '../../dao/MultisigWalletDAO'
import { EE_MS_WALLET_ADDED, EE_MS_WALLET_REMOVED, EE_MS_WALLETS_COUNT } from '../../dao/constants/WalletsManagerDAO'
import Amount from '../../models/Amount'
import WalletNoticeModel, { statuses } from '../../models/notices/WalletNoticeModel'
import TokenModel from '../../models/tokens/TokenModel'
import MultisigWalletPendingTxModel from '../../models/wallet/MultisigWalletPendingTxModel'
import OwnerModel from '../../models/wallet/OwnerModel'
import { notify, notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/constants'
import { formatBalances, getWalletBalances, subscribeOnTokens } from '../tokens/utils'
import {
  EE_CONFIRMATION,
  EE_CONFIRMATION_NEEDED,
  EE_MULTI_TRANSACTION,
  EE_OWNER_ADDED,
  EE_OWNER_REMOVED,
  EE_REQUIREMENT_CHANGED,
  EE_REVOKE,
  EE_SINGLE_TRANSACTION,
} from '../../services/constants'
import multisigWalletService from '../../services/MultisigWalletService'
import { getTxList } from '../wallets/actions'
import { ETH } from '../../dao/constants'
import { getMultisigWallets } from '../wallet/selectors/models'
import { getEthMultisigWallet } from './selectors/models'
import { daoByType } from '../daos/selectors'
import MultisigEthWalletModel from '../../models/wallet/MultisigEthWalletModel'
import tokenService from '../../services/TokenService'

import {
  ETH_MULTISIG_2_FA_CONFIRMED,
  ETH_MULTISIG_BALANCE,
  ETH_MULTISIG_FETCHED,
  ETH_MULTISIG_FETCHING,
  ETH_MULTISIG_INIT,
  ETH_MULTISIG_REMOVE,
  ETH_MULTISIG_UPDATE,
} from './constants'
import { getAccount } from '../session/selectors/models'
import { getTokens } from '../tokens/selectors'
import TxHistoryModel from '../../models/wallet/TxHistoryModel'
import { executeTransaction } from '../ethereum/thunks'

const updateEthMultisigWallet = (wallet: MultisigEthWalletModel) => ({ type: ETH_MULTISIG_UPDATE, wallet })

const setEthMultisigWalletBalance = (walletId, balance) => ({
  type: ETH_MULTISIG_BALANCE,
  walletId,
  balance,
})

export const watchMultisigWallet = (wallet: MultisigEthWalletModel): Promise => {
  try {
    return multisigWalletService.subscribeToWalletDAO(wallet)
  } catch (e) {
    // eslint-disable-next-line
    console.error('watch error', e.message)
  }
}

const subscribeOnWalletManager = () => (dispatch, getState) => {
  const walletsManagerDAO = daoByType('WalletsManager')(getState())
  walletsManagerDAO
    .on(EE_MS_WALLET_ADDED, async (wallet: MultisigEthWalletModel) => {
      const wallets = getMultisigWallets(getState())
      ethereumProvider.subscribeNewWallet(wallet.address)

      const walletFromDuck = wallets.item(wallet.id)
      const walletName = walletFromDuck && walletFromDuck.name ? walletFromDuck.name : ''

      dispatch({
        type: ETH_MULTISIG_FETCHED,
        wallet: new MultisigEthWalletModel({
          ...wallet,
          transactionHash: null,
          isPending: false,
          name: walletName,
        }),
      })

      const txHash = wallet.transactionHash

      if (txHash) {
        // created via event
        // address arrived, delete temporary hash
        dispatch({ type: ETH_MULTISIG_REMOVE, id: txHash })
        dispatch(notify(new WalletNoticeModel({
          address: wallet.address,
          action: statuses.CREATED,
        })))
      }

      dispatch(updateEthMultisigWalletBalance({ wallet }))

      await watchMultisigWallet(wallet)
    })
    .on(EE_MS_WALLETS_COUNT, (count) => {
      dispatch({ type: ETH_MULTISIG_FETCHING, count })
    })
    .on(EE_MS_WALLET_REMOVED, (walletId) => {
      dispatch({ type: ETH_MULTISIG_REMOVE, id: walletId })
    })
}

const handleTransfer = (walletId, multisigTransactionModel) => async (dispatch, getState) => {
  let wallet = getMultisigWallets(getState()).item(walletId)
  const pendingTxList = wallet.pendingTxList.remove(multisigTransactionModel)
  wallet = new MultisigEthWalletModel({
    ...wallet,
    pendingTxList,
  })
  dispatch(updateEthMultisigWallet(wallet))
  await dispatch(getTransactionsForEthMultisigWallet({ wallet, forcedOffset: true }))
}

const subscribeOnMultisigWalletService = () => (dispatch, getState) => {
  multisigWalletService
    .on(EE_OWNER_ADDED, (walletId, owner: OwnerModel) => {
      const wallet = getMultisigWallets(getState()).item(walletId)
      if (!wallet) {
        return
      }
      dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({
        ...wallet,
        owners: wallet.owners.add(owner),
      })))
    })
    .on(EE_OWNER_REMOVED, (walletId, owner: OwnerModel) => {
      const wallet = getMultisigWallets(getState()).item(walletId)
      const owners = wallet.owners().remove(owner)
      dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({
        ...wallet,
        owners,
      })))
    })
    .on(EE_MULTI_TRANSACTION, (walletId, multisigTransactionModel) => dispatch(handleTransfer(walletId, multisigTransactionModel)))
    .on(EE_SINGLE_TRANSACTION, (walletId, multisigTransactionModel) => dispatch(handleTransfer(walletId, multisigTransactionModel)))
    .on(EE_REVOKE, (walletId, id) => {
      const wallet: MultisigEthWalletModel = getMultisigWallets(getState()).item(walletId)
      const pendingTxList = wallet.pendingTxList
      const pendingTx = new MultisigWalletPendingTxModel({ ...pendingTxList[id], isConfirmed: false })
      dispatch(updateEthMultisigWallet(wallet.updatePendingTx(pendingTx)))
    })
    .on(EE_CONFIRMATION, (walletId, id, owner) => {
      if (owner !== getAccount(getState())) {
        return
      }
      const wallet: MultisigEthWalletModel = getMultisigWallets(getState()).item(walletId)
      if (!wallet) {
        return
      }

      const pendingTxList = wallet.pendingTxList
      let pendingTx = pendingTxList[id]

      if (!pendingTx) {
        return
      }
      pendingTx = new MultisigWalletPendingTxModel({ ...pendingTxList[id], isConfirmed: true })
      dispatch(updateEthMultisigWallet(wallet.updatePendingTx(pendingTx)))
    })
    .on(EE_CONFIRMATION_NEEDED, (walletId, pendingTx: MultisigWalletPendingTxModel) => {
      const wallet: MultisigEthWalletModel = getMultisigWallets(getState()).item(walletId)
      const pendingTxList = wallet.pendingTxList
      dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({
        ...wallet,
        pendingTxList: pendingTxList.update(pendingTx),
      })))
    })
    .on(EE_REQUIREMENT_CHANGED, (walletId, required) => {
      const wallet: MultisigEthWalletModel = getMultisigWallets(getState()).item(walletId)

      dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({
        ...wallet,
        requiredSignatures: required,
      })))
    })
}

export const initMultisigWalletManager = () => async (dispatch, getState) => {
  if (getMultisigWallets(getState()).isInited()) {
    return
  }
  dispatch({ type: ETH_MULTISIG_INIT, isInited: true })
  const walletsManagerDAO = daoByType('WalletsManager')(getState())
  dispatch(subscribeOnWalletManager())
  dispatch(subscribeOnMultisigWalletService())

  // all ready, start fetching
  walletsManagerDAO.fetchWallets()
}

export const createWallet = (wallet: MultisigEthWalletModel) => (dispatch, getState) => {
  try {
    const state = getState()
    const walletsManagerDAO = daoByType('WalletsManager')(state)
    const tx = walletsManagerDAO.createWallet(wallet)

    if (tx) {
      dispatch(executeTransaction({ tx }))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('create wallet error', e.message)
  }
}

export const create2FAWallet = (wallet: MultisigEthWalletModel, feeMultiplier) => async (dispatch, getState) => {
  try {
    const walletsManagerDAO = daoByType('WalletsManager')(getState())
    const tx = walletsManagerDAO.create2FAWallet(wallet)

    if (tx) {
      dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('create wallet error', e.message)
  }
}

export const removeWallet = (wallet: MultisigEthWalletModel) => async (dispatch, getState) => {
  try {
    const { account } = getState().get(DUCK_SESSION)
    dispatch({ type: ETH_MULTISIG_REMOVE, id: wallet.id })
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    const tx = dao.removeWallet(account)
    if (tx) {
      dispatch(executeTransaction({ tx }))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('delete error', e.message)
    dispatch(updateEthMultisigWallet(wallet))
  }
}

export const addOwner = (wallet: MultisigEthWalletModel, ownerAddress: string) => async (/*dispatch*/) => {
  // dispatch(updateEthMultisigWallet(wallet.isPending(true)))
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    await dao.addOwner(wallet, ownerAddress)
  } catch (e) {
    // eslint-disable-next-line
    console.error('add owner error', e.message)
  }
}

export const removeOwner = (wallet, ownerAddress) => async (/*dispatch*/) => {
  // dispatch(updateEthMultisigWallet(wallet.isPending(true)))
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    await dao.removeOwner(wallet, ownerAddress)
  } catch (e) {
    // eslint-disable-next-line
    console.error('remove owner error', e.message)
  }
}

export const multisigTransfer = (wallet: MultisigEthWalletModel, token, amount, recipient, feeMultiplier) => async (dispatch, getState) => {
  try {
    let value
    if (wallet.is2FA) {
      const walletsManagerDAO = daoByType('WalletsManager')(getState())
      value = await walletsManagerDAO.getOraclePrice()
    }
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    const tx = dao.transfer(wallet, token, amount, recipient, value)

    if (tx) {
      await dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('ms transfer error', e.message)
  }
}

export const confirmMultisigTx = (wallet, tx: MultisigWalletPendingTxModel) => async (dispatch) => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    const newTx = dao.confirmPendingTx(tx)

    if (tx) {
      await dispatch(executeTransaction({ tx: newTx }))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('confirm ms tx error', e.message)
  }
}

export const changeRequirement = (wallet, newRequired: number) => async (dispatch) => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    await dao.changeRequirement(newRequired)
  } catch (e) {
    // eslint-disable-next-line
    dispatch(notifyError(e, 'changeRequirement'))
  }
}

export const revokeMultisigTx = (wallet: MultisigEthWalletModel, tx: MultisigWalletPendingTxModel) => async (dispatch) => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    const newTx = dao.revokePendingTx(tx)

    if (tx) {
      await dispatch(executeTransaction({ tx: newTx }))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('revoke ms tx error', e.message)
  }
}

export const estimateGasFor2FAForm = (account, gasPriceMultiplier = 1, callback) => async (dispatch, getState) => {
  try {
    const walletsManagerDAO = daoByType('WalletsManager')(getState())
    if (!walletsManagerDAO) {
      throw new Error('Dao is undefined')
    }
    const { gasLimit, gasFee, gasPrice } = await walletsManagerDAO.estimateGas('create2FAWallet', [0], new BigNumber(0), account)
    callback(null, {
      gasLimit,
      gasFee: new Amount(gasFee.mul(gasPriceMultiplier), ETH),
      gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier), ETH),
    })
  } catch (e) {
    callback(e)
  }
}

export const get2FAEncodedKey = (callback) => () => {
  return ethereumProvider.get2FAEncodedKey(callback)
}

export const confirm2FASecret = (account, confirmToken, callback) => () => {
  return ethereumProvider.confirm2FASecret(account, confirmToken, callback)
}

export const confirm2FATransfer = (txAddress, walletAddress, confirmToken, callback) => () => {
  return ethereumProvider.confirm2FAtx(txAddress, walletAddress, confirmToken, callback)
}

export const setEthMultisig2FAConfirmed = (twoFAConfirmed) => (dispatch) => dispatch({ type: ETH_MULTISIG_2_FA_CONFIRMED, twoFAConfirmed })

export const updatePendingTx = (walletAddress: string, tx: MultisigWalletPendingTxModel) => (dispatch, getState) => {
  const wallet = getMultisigWallets(getState()).item(walletAddress)
  dispatch(updateEthMultisigWallet(wallet.updatePendingTx(new MultisigWalletPendingTxModel({ ...tx, isPending: true }))))
}

export const setMultisigWalletName = (walletId, name) => (dispatch, getState) => {
  const wallet = getMultisigWallets(getState()).item(walletId)
  if (wallet) {
    dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({
      ...wallet,
      name,
    })))
  }
}

export const updateEthMultisigWalletBalance = ({ wallet }) => async (dispatch) => {
  getWalletBalances({ wallet })
    .then((balancesResult) => {
      dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({
        ...wallet,
        balances: {
          ...wallet.balances,
          ...formatBalances(wallet.blockchain, balancesResult),
        },
      })))
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log('call balances from middleware is failed', e)
      const updateBalance = (token: TokenModel) => async () => {
        if (token.blockchain() === wallet.blockchain) {
          const dao = tokenService.getDAO(token)
          const balance = await dao.getAccountBalance(wallet.address)
          if (balance) {
            dispatch(setEthMultisigWalletBalance(wallet.id, new Amount(balance, token.symbol(), true)))
          }
        }
      }
      dispatch(subscribeOnTokens(updateBalance))
    })
}

export const getTransactionsForEthMultisigWallet = ({ wallet, forcedOffset }) => async (dispatch, getState) => {
  if (!wallet) {
    return null
  }
  const tokens = getTokens(getState())
  dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({
    ...wallet,
    transactions: new TxHistoryModel(
      {
        ...wallet.transactions,
        isFetching: true,
      }),
  })))
  const transactions = await getTxList({ wallet, forcedOffset, tokens })
  const newWallet = getEthMultisigWallet(wallet.id)(getState())
  dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({ ...newWallet, transactions })))
}
