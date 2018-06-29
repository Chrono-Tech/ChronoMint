/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { change } from 'redux-form/immutable'
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
import { EVENT_NEW_TRANSFER, FETCH_NEW_BALANCE } from '../../dao/AbstractTokenDAO'
import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import type MultisigWalletDAO from '../../dao/MultisigWalletDAO'
import { EE_MS_WALLET_ADDED, EE_MS_WALLET_REMOVED, EE_MS_WALLETS_COUNT } from '../../dao/MultisigWalletsManagerDAO'
import Amount from '../../models/Amount'
import WalletNoticeModel, { statuses } from '../../models/notices/WalletNoticeModel'
import BalanceModel from '../../models/tokens/BalanceModel'
import TokenModel from '../../models/tokens/TokenModel'
import TxExecModel from '../../models/TxExecModel'
import type TxModel from '../../models/TxModel'
import type MultisigWalletModel from '../../models/wallet/MultisigWalletModel'
import type MultisigWalletPendingTxModel from '../../models/wallet/MultisigWalletPendingTxModel'
import OwnerModel from '../../models/wallet/OwnerModel'
import { notify, notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/actions'
import { DUCK_TOKENS, subscribeOnTokens } from '../tokens/actions'
import multisigWalletService, {
  EE_CONFIRMATION,
  EE_CONFIRMATION_NEEDED,
  EE_DEPOSIT,
  EE_MULTI_TRANSACTION,
  EE_OWNER_ADDED,
  EE_OWNER_REMOVED,
  EE_REQUIREMENT_CHANGED,
  EE_REVOKE,
  EE_SINGLE_TRANSACTION,
} from '../../services/MultisigWalletService'
import tokenService from '../../services/TokenService'
import { ETH, getTokensBalancesAndWatch, getTransactionsForWallet } from '../mainWallet/actions'
import { getTokens } from '../tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from '../../dao/EthereumDAO'
import { getMultisigWallets } from '../wallet/selectors/models'

export const FORM_2FA_WALLET = 'Form2FAWallet'
export const FORM_2FA_STEPS = [
  'formStep',
  'waitStep',
  'successStep',
]

export const DUCK_MULTISIG_WALLET = 'multisigWallet'

export const MULTISIG_INIT = 'multisig/INIT'
export const MULTISIG_FETCHING = 'multisig/FETCHING'
export const MULTISIG_FETCHED = 'multisig/FETCHED'
export const MULTISIG_UPDATE = 'multisigWallet/UPDATE'
export const MULTISIG_BALANCE = 'multisigWallet/BALANCE'
export const MULTISIG_SELECT = 'multisigWallet/SELECT'
export const MULTISIG_REMOVE = 'multisigWallet/REMOVE'
export const MULTISIG_PENDING_TX = 'multisigWallet/PENDING_TX'
export const MULTISIG_2_FA_CONFIRMED = 'multisigWallet/2_FA_CONFIRMED'

let walletsManagerDAO

const updateWallet = (wallet: MultisigWalletModel) => (dispatch) => dispatch({ type: MULTISIG_UPDATE, wallet })
export const selectMultisigWallet = (id) => (dispatch) => dispatch({ type: MULTISIG_SELECT, id })

export const watchMultisigWallet = (wallet: MultisigWalletModel): Promise => {
  try {
    return multisigWalletService.subscribeToWalletDAO(wallet)
  } catch (e) {
    // eslint-disable-next-line
    console.error('watch error', e.message)
  }
}

const fetchBalanceForToken = (token, wallet) => async (dispatch) => {
  if (!token.isERC20() && token.symbol() !== 'ETH') {
    return
  }

  const tokenDao = tokenService.getDAO(token.id())

  const balance = await tokenDao.getAccountBalance(wallet.address())
  dispatch({
    type: MULTISIG_BALANCE,
    walletId: wallet.address(),
    balance: new BalanceModel({
      id: token.id(),
      amount: new Amount(balance, token.symbol(), true),
    }),
  })
}

const handleToken = (token, wallet) => (dispatch) => {
  dispatch(fetchBalanceForToken(token, wallet))
  const tokenDAO = tokenService.getDAO(token.id())

  tokenDAO
    .on(FETCH_NEW_BALANCE, () => {
      dispatch(fetchBalanceForToken(token, wallet))
    })
    .on(EVENT_NEW_TRANSFER, (tx: TxModel) => {
      if (!(tx.from() === wallet.address() || tx.to() === wallet.address())) {
        return
      }
      dispatch(fetchBalanceForToken(token, wallet))
    })
}

const subscribeOnWalletManager = () => (dispatch, getState) => {
  walletsManagerDAO
    .on(EE_MS_WALLET_ADDED, async (wallet: MultisigWalletModel) => {
      const wallets = getMultisigWallets(getState())
      let updatedWallet = wallet.transactionHash(null).isPending(false)
      if (wallets.item(wallet.id()) && wallets.item(wallet.id()).name()) {
        updatedWallet = updatedWallet.name(wallets.item(wallet.id()).name())
      }
      dispatch({ type: MULTISIG_FETCHED, wallet: updatedWallet })
      await dispatch(check2FAChecked())
      dispatch(change(FORM_2FA_WALLET, 'step', FORM_2FA_STEPS[2]))

      const txHash = wallet.transactionHash()

      if (txHash) {
        // created via event
        // address arrived, delete temporary hash
        dispatch({ type: MULTISIG_REMOVE, id: txHash })
        dispatch(notify(new WalletNoticeModel({
          address: wallet.address(),
          action: statuses.CREATED,
        })))
      }

      await watchMultisigWallet(updatedWallet)

      dispatch(subscribeOnTokens((token) => handleToken(token, wallet)))
      dispatch(selectWalletIfOne())
    })
    .on(EE_MS_WALLETS_COUNT, (count) => {
      dispatch({ type: MULTISIG_FETCHING, count })
    })
    .on(EE_MS_WALLET_REMOVED, (walletId) => {
      dispatch({ type: MULTISIG_REMOVE, id: walletId })
    })
}

const handleTransfer = (walletId, multisigTransactionModel) => async (dispatch, getState) => {
  let wallet = getMultisigWallets(getState()).item(walletId)
  const pendingTxList = wallet.pendingTxList().remove(multisigTransactionModel)
  wallet = wallet.pendingTxList(pendingTxList)
  dispatch(updateWallet(wallet))
  await dispatch(getTransactionsForWallet({ wallet, address: wallet.address(), blockchain: wallet.blockchain(), forcedOffset: true }))

  if (!multisigTransactionModel.symbol()) {
    getTokens(getState()).items().map((token) => {
      if (token.blockchain() === BLOCKCHAIN_ETHEREUM) {
        dispatch(fetchBalanceForToken(token, wallet))
      }
    })
    return
  }
  const token: TokenModel = getState().get(DUCK_TOKENS).getBySymbol(multisigTransactionModel.symbol())
  dispatch(fetchBalanceForToken(token, wallet))
}

const subscribeOnMultisigWalletService = () => (dispatch, getState) => {
  multisigWalletService
    .on(EE_OWNER_ADDED, (walletId, owner: OwnerModel) => {
      const wallet = getMultisigWallets(getState()).item(walletId)
      if (!wallet) {
        return
      }
      dispatch(updateWallet(wallet.owners(wallet.owners().add(owner))))
    })
    .on(EE_OWNER_REMOVED, (walletId, owner: OwnerModel) => {
      const wallet = getMultisigWallets(getState()).item(walletId)
      const owners = wallet.owners().remove(owner)
      dispatch(updateWallet(wallet.owners(owners)))
    })
    .on(EE_MULTI_TRANSACTION, (walletId, multisigTransactionModel) => dispatch(handleTransfer(walletId, multisigTransactionModel)))
    .on(EE_SINGLE_TRANSACTION, (walletId, multisigTransactionModel) => dispatch(handleTransfer(walletId, multisigTransactionModel)))
    .on(EE_REVOKE, (walletId, id) => {
      const wallet: MultisigWalletModel = getMultisigWallets(getState()).item(walletId)
      const pendingTxList = wallet.pendingTxList()
      const pendingTx = pendingTxList.item(id).isConfirmed(false)
      dispatch(updateWallet(wallet.pendingTxList(pendingTxList.list(pendingTxList.list().set(id, pendingTx)))))
    })
    .on(EE_CONFIRMATION, (walletId, id, owner) => {
      if (owner !== getState().get(DUCK_SESSION).account) {
        return
      }
      const wallet: MultisigWalletModel = getMultisigWallets(getState()).item(walletId)
      if (!wallet) {
        return
      }

      const pendingTxList = wallet.pendingTxList()
      let pendingTx = pendingTxList.item(id)
      if (!pendingTx) {
        return
      }
      pendingTx = pendingTx.isConfirmed(true)
      dispatch(updateWallet(wallet.pendingTxList(pendingTxList.update(pendingTx))))
    })
    .on(EE_CONFIRMATION_NEEDED, (walletId, pendingTxModel: MultisigWalletPendingTxModel) => {
      const wallet: MultisigWalletModel = getMultisigWallets(getState()).item(walletId)
      const pendingTxList = wallet.pendingTxList()
      dispatch(updateWallet(wallet.pendingTxList(pendingTxList.update(pendingTxModel))))
    })
    .on(EE_DEPOSIT, (walletId, symbol) => {
      const wallet: MultisigWalletModel = getMultisigWallets(getState()).item(walletId)
      const token = getState().get(DUCK_TOKENS).getBySymbol(symbol)
      dispatch(fetchBalanceForToken(token, wallet))
    })
    .on(EE_REQUIREMENT_CHANGED, (walletId, required) => {
      const wallet: MultisigWalletModel = getMultisigWallets(getState()).item(walletId)
      dispatch(updateWallet(wallet.requiredSignatures(required)))
    })
}

export const initMultisigWalletManager = () => async (dispatch, getState) => {
  if (getMultisigWallets(getState()).isInited()) {
    return
  }
  dispatch({ type: MULTISIG_INIT, isInited: true })

  walletsManagerDAO = await contractsManagerDAO.getWalletsManagerDAO()
  let wallets = getState().get(DUCK_MULTISIG_WALLET)
  wallets.items().map((wallet) => {
    if (wallet.isDerived()) {
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
        default:
      }

      dispatch(subscribeOnTokens(getTokensBalancesAndWatch(wallet.address(), wallet.blockchain(), wallet.customTokens())))
    }
  })

  dispatch(subscribeOnWalletManager())
  dispatch(subscribeOnMultisigWalletService())

  dispatch(check2FAChecked())
  // all ready, start fetching
  walletsManagerDAO.fetchWallets()
}

const selectWalletIfOne = () => (dispatch, getState) => {
  const wallets = getMultisigWallets(getState())
  if (wallets.size() === 1) {
    dispatch(selectMultisigWallet(wallets.first().id()))
  }
}

export const createWallet = (wallet: MultisigWalletModel) => async (dispatch) => {
  try {
    const txHash = await walletsManagerDAO.createWallet(wallet)
    dispatch(updateWallet(wallet.isPending(true).transactionHash(txHash)))
    dispatch(selectWalletIfOne())
    return txHash
  } catch (e) {
    // eslint-disable-next-line
    console.error('create wallet error', e.message)
  }
}

export const create2FAWallet = (wallet: MultisigWalletModel, feeMultiplier) => async (dispatch) => {
  try {
    const txHash = await walletsManagerDAO.create2FAWallet(wallet, feeMultiplier)
    dispatch(updateWallet(wallet.isPending(true).transactionHash(txHash)))
    return txHash
  } catch (e) {
    // eslint-disable-next-line
    console.error('create wallet error', e.message)
  }
}

export const removeWallet = (wallet: MultisigWalletModel) => async (dispatch, getState) => {
  try {
    const { account } = getState().get(DUCK_SESSION)
    // dispatch(updateWallet(wallet.isPending(true)))
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.removeWallet(wallet, account)
  } catch (e) {
    // eslint-disable-next-line
    console.error('delete error', e.message)
  }
}

export const addOwner = (wallet: MultisigWalletModel, ownerAddress: string) => async (/*dispatch*/) => {
  // dispatch(updateWallet(wallet.isPending(true)))
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.addOwner(wallet, ownerAddress)
  } catch (e) {
    // eslint-disable-next-line
    console.error('add owner error', e.message)
  }
}

export const removeOwner = (wallet, ownerAddress) => async (/*dispatch*/) => {
  // dispatch(updateWallet(wallet.isPending(true)))
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.removeOwner(wallet, ownerAddress)
  } catch (e) {
    // eslint-disable-next-line
    console.error('remove owner error', e.message)
  }
}

export const multisigTransfer = (wallet, token, amount, recipient, feeMultiplier) => async () => {
  try {
    let value
    if (wallet.is2FA()) {
      const walletsManagerDAO = await contractsManagerDAO.getWalletsManagerDAO()
      value = await walletsManagerDAO.getOraclePrice()
    }
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.transfer(wallet, token, amount, recipient, feeMultiplier, value)
  } catch (e) {
    // eslint-disable-next-line
    console.error('ms transfer error', e.message)
  }
}

export const confirmMultisigTx = (wallet, tx: MultisigWalletPendingTxModel) => async () => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.confirmPendingTx(tx)
  } catch (e) {
    // eslint-disable-next-line
    console.error('confirm ms tx error', e.message)
  }
}

export const changeRequirement = (wallet, newRequired: Number) => async (dispatch) => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.changeRequirement(newRequired)
  } catch (e) {
    // eslint-disable-next-line
    dispatch(notifyError(e, 'changeRequirement'))
  }
}

export const revokeMultisigTx = (wallet: MultisigWalletModel, tx: MultisigWalletPendingTxModel) => async () => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.revokePendingTx(tx)
  } catch (e) {
    // eslint-disable-next-line
    console.error('revoke ms tx error', e.message)
  }
}

export const getPendingData = (wallet, pending: MultisigWalletPendingTxModel) => async (dispatch) => {
  try {
    dispatch({ type: MULTISIG_PENDING_TX, walletId: wallet.id(), pending: pending.isPending(true) })
    const walletDAO: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    const decodedTx: TxExecModel = await walletDAO.getPendingData(pending.id())
    dispatch({ type: MULTISIG_PENDING_TX, walletId: wallet.id(), pending: pending.decodedTx(decodedTx).isPending(false) })
  } catch (e) {
    // eslint-disable-next-line
    console.error('get pending data error', e.message)
  }
}

export const estimateGasFor2FAForm = async (account, gasPriceMultiplier = 1, callback) => {
  try {
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
  dispatch({ type: MULTISIG_2_FA_CONFIRMED, twoFAConfirmed })
}

export const updatePendingTx = (walletAddress: string, tx: MultisigWalletPendingTxModel) => (dispatch, getState) => {
  const wallet = getMultisigWallets(getState()).item(walletAddress)
  dispatch(updateWallet(wallet.pendingTxList(wallet.pendingTxList().update(tx.isPending(true)))))
}

export const checkConfirm2FAtx = (txAddress, callback) => {
  return ethereumProvider.checkConfirm2FAtx(txAddress, callback)
}

export const setMultisigWalletName = (address, name) => (dispatch, getState) => {
  const wallet = getMultisigWallets(getState()).item(address)
  if (wallet) {
    dispatch({ type: MULTISIG_UPDATE, wallet: wallet.name(name) })
  }
}
