/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { change } from 'redux-form/immutable'
import type MultisigWalletDAO from '../../dao/MultisigWalletDAO'
import { EE_MS_WALLET_ADDED, EE_MS_WALLET_REMOVED, EE_MS_WALLETS_COUNT } from '../../dao/constants/WalletsManagerDAO'
import Amount from '../../models/Amount'
import WalletNoticeModel, { statuses } from '../../models/notices/WalletNoticeModel'
import TokenModel from '../../models/tokens/TokenModel'
import MultisigWalletPendingTxModel from '../../models/wallet/MultisigWalletPendingTxModel'
import OwnerModel from '../../models/wallet/OwnerModel'
import { notify, notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/constants'
import { alternateTxHandlingFlow, subscribeOnTokens } from '../tokens/actions'
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
import { getTxList } from '../mainWallet/actions'
import { ETH } from '../../dao/constants'
import { getMultisigWallets } from '../wallet/selectors/models'
import { getEthMultisigWallet, getWallets } from './selectors/models'
import DerivedWalletModel from '../../models/wallet/DerivedWalletModel'
import { daoByType } from '../daos/selectors'
import MultisigEthWalletModel from '../../models/wallet/MultisigEthWalletModel'
import tokenService from '../../services/TokenService'
import {
  ETH_MULTISIG_2_FA_CONFIRMED,
  ETH_MULTISIG_REMOVE,
  ETH_MULTISIG_SELECT,
  ETH_MULTISIG_BALANCE,
  ETH_MULTISIG_UPDATE,
  ETH_MULTISIG_FETCHED,
  ETH_MULTISIG_FETCHING,
  ETH_MULTISIG_INIT,
  FORM_2FA_STEPS,
  FORM_2FA_WALLET,
} from './constants'
import { getAccount } from '../session/selectors/models'
import { getTokens } from '../tokens/selectors'
import TxHistoryModel from '../../models/wallet/TxHistoryModel'

const updateEthMultisigWallet = (wallet: MultisigEthWalletModel) => (dispatch) => dispatch({ type: ETH_MULTISIG_UPDATE, wallet })
export const selectMultisigWallet = (id) => (dispatch) => dispatch({ type: ETH_MULTISIG_SELECT, id })

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
      const walletDao = multisigWalletService.getWalletDAO(wallet.address)
      dispatch(alternateTxHandlingFlow(walletDao))

      const wallets = getMultisigWallets(getState())

      const walletFromDuck = wallets.item(wallet.id)
      let walletName = walletFromDuck && walletFromDuck.name ? walletFromDuck.name : ''

      dispatch({
        type: ETH_MULTISIG_FETCHED,
        wallet: new MultisigEthWalletModel({
          ...wallet,
          transactionHash: null,
          isPending: false,
          name: walletName,
        }),
      })

      await dispatch(check2FAChecked())
      dispatch(change(FORM_2FA_WALLET, 'step', FORM_2FA_STEPS[2]))
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

  const wallets = getWallets(getState())
  wallets.items().map((wallet: DerivedWalletModel) => {
    const { account } = getState().get(DUCK_SESSION)

    const handleToken = (token: TokenModel) => async (dispatch) => {
      if (token.blockchain() === wallet.blockchain()) {
        // TODO fix this handle
        // const dao = tokenService.getDAO(token)
        // let balance = await dao.getAccountBalance(wallet.address())
        // dispatch({
        //   type: ETH_MULTISIG_BALANCE,
        //   walletId: wallet.address(),
        //   balance: new BalanceModel({
        //     id: token.id(),
        //     amount: new Amount(balance, token.symbol(), true),
        //   }),
        // })
      }
    }

    // if (isOwner(wallet, account)) {
    //   dispatch(subscribeOnTokens(handleToken))
    // }
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

  // walletsManagerDAO.on('mained', (tx: TxExecModel) => {
  //   const wallet = getState().get(DUCK_ETH_MULTISIG_WALLET).item(tx.id())
  //   dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({ ...wallet, address: tx.hash, isPending: false, isFetched: true })))
  // })
  /*let wallets = getState().get(DUCK_ETH_MULTISIG_WALLET)
  wallets.items().map((wallet) => {
    if (wallet.isDerived() && isOwner(wallet, account)) {
      switch (wallet.blockchain()) {
        case BLOCKCHAIN_BITCOIN:
          btcProvider.createNewChildAddress(wallet.deriveNumber())
          btcProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_BITCOIN_CASH:
          bccProvider.createNewChildAddress(wallet.deriveNumber())
          bccProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_BITCOIN_GOLD:
          btgProvider.createNewChildAddress(wallet.deriveNumber())
          btgProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_LITECOIN:
          ltcProvider.createNewChildAddress(wallet.deriveNumber())
          ltcProvider.subscribeNewWallet(wallet.address)
          break
        case BLOCKCHAIN_ETHEREUM:
          dispatch(subscribeOnTokens(getTokensBalancesAndWatch(wallet.address, wallet.blockchain(), wallet.customTokens())))
          break
        default:
      }
    }
  })*/

  dispatch(subscribeOnWalletManager())
  dispatch(subscribeOnMultisigWalletService())

  dispatch(check2FAChecked())
  // all ready, start fetching
  walletsManagerDAO.fetchWallets()
}

export const createWallet = (wallet: MultisigEthWalletModel) => (dispatch, getState) => {
  try {
    const walletsManagerDAO = daoByType('WalletsManager')(getState())
    walletsManagerDAO.createWallet(wallet)
    dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({ ...wallet, isPending: true })))
  } catch (e) {
    // eslint-disable-next-line
    console.error('create wallet error', e.message)
  }
}

export const create2FAWallet = (wallet: MultisigEthWalletModel, feeMultiplier) => async (dispatch, getState) => {
  try {
    const walletsManagerDAO = daoByType('WalletsManager')(getState())
    const txHash = await walletsManagerDAO.create2FAWallet(wallet, feeMultiplier)
    dispatch(updateEthMultisigWallet(new MultisigEthWalletModel({ ...wallet, isPending: true, transactionHash: txHash })))
    return txHash
  } catch (e) {
    // eslint-disable-next-line
    console.error('create wallet error', e.message)
  }
}

export const removeWallet = (wallet: MultisigEthWalletModel) => async (dispatch, getState) => {
  try {
    const { account } = getState().get(DUCK_SESSION)
    // dispatch(updateEthMultisigWallet(wallet.isPending(true)))
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    await dao.removeWallet(wallet, account)
  } catch (e) {
    // eslint-disable-next-line
    console.error('delete error', e.message)
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
    await dao.transfer(wallet, token, amount, recipient, feeMultiplier, value)
  } catch (e) {
    // eslint-disable-next-line
    console.error('ms transfer error', e.message)
  }
}

export const confirmMultisigTx = (wallet, tx: MultisigWalletPendingTxModel) => async () => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    await dao.confirmPendingTx(tx)
  } catch (e) {
    // eslint-disable-next-line
    console.error('confirm ms tx error', e.message)
  }
}

export const changeRequirement = (wallet, newRequired: Number) => async (dispatch) => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    await dao.changeRequirement(newRequired)
  } catch (e) {
    // eslint-disable-next-line
    dispatch(notifyError(e, 'changeRequirement'))
  }
}

export const revokeMultisigTx = (wallet: MultisigEthWalletModel, tx: MultisigWalletPendingTxModel) => async () => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address)
    await dao.revokePendingTx(tx)
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

export const check2FAChecked = () => async (dispatch) => {
  const result = await dispatch(get2FAEncodedKey())
  let twoFAConfirmed
  if (typeof result === 'object' && result.code) {
    twoFAConfirmed = true
  } else {
    twoFAConfirmed = false
  }
  dispatch({ type: ETH_MULTISIG_2_FA_CONFIRMED, twoFAConfirmed })
}

export const updatePendingTx = (walletAddress: string, tx: MultisigWalletPendingTxModel) => (dispatch, getState) => {
  const wallet = getMultisigWallets(getState()).item(walletAddress)
  dispatch(updateEthMultisigWallet(wallet.updatePendingTx(new MultisigWalletPendingTxModel({ ...tx, isPending: true }))))
}

export const checkConfirm2FAtx = (txAddress, callback) => {
  return ethereumProvider.checkConfirm2FAtx(txAddress, callback)
}

export const setMultisigWalletName = (address, name) => (dispatch, getState) => {
  const wallet = getMultisigWallets(getState()).item(address)
  if (wallet) {
    dispatch({ type: ETH_MULTISIG_UPDATE, wallet: wallet.name(name) })
  }
}

export const updateEthMultisigWalletBalance = ({ wallet }) => async (dispatch) => {
  const updateBalance = (token: TokenModel) => async () => {
    if (token.blockchain() === wallet.blockchain) {
      const dao = tokenService.getDAO(token)
      let balance = await dao.getAccountBalance(wallet.address)
      if (balance) {
        await dispatch({
          type: ETH_MULTISIG_BALANCE,
          walletId: wallet.id,
          balance: new Amount(balance, token.symbol(), true),
        })
      }
    }
  }

  dispatch(subscribeOnTokens(updateBalance))
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
