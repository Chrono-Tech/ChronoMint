import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type MultisigWalletDAO from 'dao/MultisigWalletDAO'
import { EVENT_MS_WALLETS_COUNT, EVENT_NEW_MS_WALLET } from 'dao/MultisigWalletsManagerDAO'
import Amount from 'models/Amount'
import WalletNoticeModel, { statuses } from 'models/notices/WalletNoticeModel'
import BalanceModel from 'models/tokens/BalanceModel'
import TokenModel from 'models/tokens/TokenModel'
import TxExecModel from 'models/TxExecModel'
import type MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import type MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'
import { notify } from 'redux/notifier/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS, subscribeOnTokens } from 'redux/tokens/actions'
import multisigWalletService, { EVENT_CONFIRMATION, EVENT_CONFIRMATION_NEEDED, EVENT_DEPOSIT, EVENT_MULTI_TRANSACTION, EVENT_OWNER_ADDED, EVENT_OWNER_REMOVED, EVENT_REVOKE, } from 'services/MultisigWalletService'
import tokenService from 'services/TokenService'

export const DUCK_MULTISIG_WALLET = 'multisigWallet'

export const MULTISIG_INIT = 'multisig/INIT'
export const MULTISIG_FETCHING = 'multisig/FETCHING'
export const MULTISIG_FETCHED = 'multisig/FETCHED'
export const MULTISIG_UPDATE = 'multisigWallet/UPDATE'
export const MULTISIG_BALANCE = 'multisigWallet/BALANCE'
export const MULTISIG_SELECT = 'multisigWallet/SELECT'
export const MULTISIG_REMOVE = 'multisigWallet/REMOVE'
export const MULTISIG_PENDING_TX = 'multisigWallet/PENDING_TX'

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

const subscribeOnWalletManager = () => (dispatch, getState) => {
  walletsManagerDAO
    .on(EVENT_NEW_MS_WALLET, (wallet: MultisigWalletModel) => {
      const updatedWallet = wallet.transactionHash(null).isPending(false)
      dispatch({ type: MULTISIG_FETCHED, wallet: updatedWallet })

      const txHash = wallet.transactionHash()

      if (txHash) {
        // reselect
        const selectedWallet = getState().get(DUCK_MULTISIG_WALLET).selected()
        if (selectedWallet.transactionHash() && selectedWallet.transactionHash() === txHash) {
          dispatch(selectMultisigWallet(wallet.address()))
        }

        // created via event
        // address arrived, delete temporary hash
        dispatch({ type: MULTISIG_REMOVE, id: txHash })
        dispatch(notify(new WalletNoticeModel({
          address: wallet.address(),
          action: statuses.CREATED,
        })))
      }

      watchMultisigWallet(updatedWallet)

      dispatch(subscribeOnTokens((token) => fetchBalanceForToken(token, wallet)))
      dispatch(selectWalletIfOne())
    })
    .on(EVENT_MS_WALLETS_COUNT, (count) => {
      dispatch({ type: MULTISIG_FETCHING, count })
    })
}

const subscribeOnMultisigWalletService = () => (dispatch, getState) => {
  multisigWalletService
    .on(EVENT_OWNER_ADDED, (walletId, ownerAddress) => {
      const wallet = getState().get(DUCK_MULTISIG_WALLET).item(walletId)
      const owners = wallet.owners().update(ownerAddress)
      dispatch(updateWallet(wallet.owners(owners)))
    })
    .on(EVENT_OWNER_REMOVED, (walletId, ownerAddress) => {
      const wallet = getState().get(DUCK_MULTISIG_WALLET).item(walletId)
      const owners = wallet.owners().remove(ownerAddress)
      dispatch(updateWallet(wallet.owners(owners)))
    })
    .on(EVENT_MULTI_TRANSACTION, (walletId, multisigTransactionModel) => {
      let wallet = getState().get(DUCK_MULTISIG_WALLET).item(walletId)
      const tokens = getState().get(DUCK_TOKENS)
      const pendingTxList = wallet.pendingTxList().remove(multisigTransactionModel)
      let token: TokenModel = tokens.item(multisigTransactionModel.symbol())
      if (!token.isFetched()) {
        // eslint-disable-next-line
        console.error('token not found', multisigTransactionModel.symbol())
        return
      }
      token = token.updateBalance(false, multisigTransactionModel.value())

      // TODO @dkchv: !!!
      // dispatch(updateWallet(wallet.pendingTxList(pendingTxList).tokens(tokens.set(token.id(), token))))
    })
    .on('SingleTransact', (walletId, result) => {
      // eslint-disable-next-line
      console.log('--actions#', result)
    })
    .on(EVENT_REVOKE, (walletId, id) => {
      const wallet: MultisigWalletModel = getState().get(DUCK_MULTISIG_WALLET).item(walletId)
      const pendingTxList = wallet.pendingTxList()
      const pendingTx = pendingTxList.item(id).isConfirmed(false)
      dispatch(updateWallet(wallet.pendingTxList(pendingTxList.list(pendingTxList.list().set(id, pendingTx)))))
    })
    .on(EVENT_CONFIRMATION, (walletId, id, owner) => {
      if (owner !== getState().get(DUCK_SESSION).account) {
        return
      }

      const wallet: MultisigWalletModel = getState().get(DUCK_MULTISIG_WALLET).item(walletId)
      const pendingTxList = wallet.pendingTxList()
      let pendingTx = pendingTxList.item(id)
      if (!pendingTx) {
        return
      }
      pendingTx = pendingTx.isConfirmed(true)
      dispatch(updateWallet(wallet.pendingTxList(pendingTxList.list(pendingTxList.list().set(id, pendingTx)))))
    })
    .on(EVENT_CONFIRMATION_NEEDED, (walletId, pendingTxModel: MultisigWalletPendingTxModel) => {
      const wallet: MultisigWalletModel = getState().get(DUCK_MULTISIG_WALLET).item(walletId)
      const pendingTxList = wallet.pendingTxList()
      dispatch(updateWallet(wallet.pendingTxList(pendingTxList.update(pendingTxModel))))
    })
    .on(EVENT_DEPOSIT, (walletId, tokenId, amount) => {
      const wallet: MultisigWalletModel = getState().get(DUCK_MULTISIG_WALLET).item(walletId)
      const token: TokenModel = wallet.tokens().get(tokenId)
      dispatch(updateWallet(wallet.tokens(wallet.tokens().set(token.id(), token.updateBalance(true, amount)))))
    })
}

export const initMultisigWalletManager = () => async (dispatch, getState) => {
  if (getState().get(DUCK_MULTISIG_WALLET).isInited()) {
    return
  }
  dispatch({ type: MULTISIG_INIT, isInited: true })

  walletsManagerDAO = await contractsManagerDAO.getWalletsManagerDAO()

  dispatch(subscribeOnWalletManager())
  dispatch(subscribeOnMultisigWalletService())

  // all ready, start fetching
  walletsManagerDAO.fetchWallets()
}

const selectWalletIfOne = () => (dispatch, getState) => {
  const wallets = getState().get(DUCK_MULTISIG_WALLET)
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

export const removeWallet = (wallet: MultisigWalletModel) => async (dispatch, getState) => {
  try {
    const { account } = getState().get(DUCK_SESSION)
    dispatch(updateWallet(wallet.isPending(true)))
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.removeWallet(wallet, account)
  } catch (e) {
    // eslint-disable-next-line
    console.error('delete error', e.message)
  }
}

export const addOwner = (wallet: MultisigWalletModel, ownerAddress: string) => async (dispatch) => {
  // dispatch(updateWallet(wallet.isPending(true)))
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.addOwner(wallet, ownerAddress)
  } catch (e) {
    // eslint-disable-next-line
    console.error('add owner error', e.message)
  }
}

export const removeOwner = (wallet, ownerAddress) => async (dispatch) => {
  // dispatch(updateWallet(wallet.isPending(true)))
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.removeOwner(wallet, ownerAddress)
  } catch (e) {
    // eslint-disable-next-line
    console.error('remove owner error', e.message)
  }
}

export const multisigTransfer = (wallet, token, amount, recipient) => async () => {
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.transfer(wallet, token, amount, recipient)
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

export const revokeMultisigTx = (wallet: MultisigWalletModel, tx: MultisigWalletPendingTxModel) => async (dispatch) => {
  console.log('--actions#', tx.toJS())
  try {
    const dao: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    await dao.revokePendingTx(tx)
  } catch (e) {
    // eslint-disable-next-line
    console.error('revoke ms tx error', e.message)
  }
}

export const getPendingData = (wallet, pending: MultisigWalletPendingTxModel) => async (dispatch) => {
  console.log('--actions#', 1)
  try {
    const walletDAO: MultisigWalletDAO = multisigWalletService.getWalletDAO(wallet.address())
    const decodedTx: TxExecModel = await walletDAO.getPendingData(pending.id())
    dispatch({ type: MULTISIG_PENDING_TX, walletId: wallet.id(), pending: pending.decodedTx(decodedTx) })
  } catch (e) {
    // eslint-disable-next-line
    console.error('get pending data error', e.message)
  }
}
