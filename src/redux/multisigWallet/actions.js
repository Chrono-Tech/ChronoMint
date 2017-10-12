import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type WalletNoticeModel from 'models/notices/WalletNoticeModel'
import type WalletModel from 'models/WalletModel'
import type MultisigWalletDAO from 'dao/MultisigWalletDAO'
import type WalletPendingTxModel from 'models/WalletPendingTxModel'
import { notify } from 'redux/notifier/actions'

export const MULTISIG_FETCHING = 'multisig/FETCHING'
export const MULTISIG_FETCHED = 'multisig/FETCHED'

export const MULTISIG_UPDATE = 'multisigWallet/UPDATE'
export const MULTISIG_SELECT = 'multisigWallet/SELECT'
export const MULTISIG_REMOVE = 'multisigWallet/REMOVE'

const handleWPendingTxUpdate = (id: string, pendingTx: WalletPendingTxModel, notice: WalletNoticeModel) => (dispatch, getState) => {
  const wallet = getState().get('multisigWallet').wallets.get(id)
  let pendingTxList = wallet.pendingTxList().set(pendingTx.id(), pendingTx)
  dispatch({type: MULTISIG_UPDATE, wallet: wallet.pendingTxList(pendingTxList)})
  dispatch(notify(notice))
}

const watchMultisigWallets = (wallet: WalletModel) => async (dispatch) => {
  const callbackPendingTxUpdate = (id: string, pendingTx: WalletPendingTxModel, notice: WalletNoticeModel) => dispatch(handleWPendingTxUpdate(id, pendingTx, notice))

  try {
    const dao: MultisigWalletDAO = wallet.dao()
    if (!dao) {
      return
    }
    await Promise.all([
      dao.watchOwnerRemoved(),
      dao.watchConfirmationNeeded(wallet.id(), callbackPendingTxUpdate),
      dao.watchMultiTransact(),
      dao.watchSingleTransact(),
      dao.watchDeposit()
    ])

  } catch (e) {
    // eslint-disable-next-line
    console.error('watch error', e.message)
  }
}

const handleWalletCreate = (wallet: WalletModel, notice: WalletNoticeModel) => (dispatch, getState) => {
  dispatch({type: MULTISIG_UPDATE, wallet: wallet.isPending(false)})
  dispatch(notify(notice))
  watchMultisigWallets(wallet)
  const {wallets} = getState().get('multisigWallet')
  if (wallets.size === 1) {
    dispatch(selectWallet(wallets.first().id()))
  }
}

export const watchWalletManager = () => async (dispatch) => {
  const updateCallback = (wallet: WalletModel, notice: WalletNoticeModel) => dispatch(handleWalletCreate(wallet, notice))
  const dao = await contractsManagerDAO.getWalletsManagerDAO()
  await dao.watchWalletCreate(updateCallback)
}

export const selectWallet = (address: string) => (dispatch) => {
  dispatch({type: MULTISIG_SELECT, address})
}

export const getWallets = () => async (dispatch) => {
  dispatch({type: MULTISIG_FETCHING})
  const dao = await contractsManagerDAO.getWalletsManagerDAO()
  const wallets = await dao.getWallets()
  const walletsArray = wallets.toArray()

  // watch for every wallet
  for (let wallet of walletsArray) {
    dispatch(watchMultisigWallets(wallet))
  }

  dispatch({type: MULTISIG_FETCHED, wallets})
  if (wallets.first()) {
    dispatch(selectWallet(wallets.first().id()))
  }
}

export const createWallet = (wallet: WalletModel) => async (dispatch) => {
  try {
    const dao = await contractsManagerDAO.getWalletsManagerDAO()
    const txHash = await dao.createWallet(wallet)
    dispatch({type: MULTISIG_UPDATE, wallet: wallet.isPending(true).transactionHash(txHash)})
  } catch (e) {
    // eslint-disable-next-line
    console.error('create wallet error', e.message)
  }
}

export const removeWallet = (wallet: WalletModel) => async (dispatch, getState) => {
  try {
    const {account} = getState().get('session')
    const dao: MultisigWalletDAO = wallet.dao()
    await dao.removeWallet(wallet, account)
    dispatch({type: MULTISIG_REMOVE, wallet})
  } catch (e) {
    // eslint-disable-next-line
    console.error('delete error', e.message)
  }
}

export const updateWallet = (/*wallet: WalletModel*/) => (/*dispatch*/) => {
  // TODO @dkchv: !!!!
}

export const addOwner = (wallet) => async () => {
  // TODO @dkchv: !!!
  const newOwner = '0xd882e17d712b63e52896109f35fbccc702301e32'
  try {
    const dao: MultisigWalletDAO = wallet.dao()
    await dao.addOwner(wallet, newOwner)
  } catch (e) {
    // eslint-disable-next-line
    console.error('error', e.message)
  }
}

export const multisigTransfer = (token, amount, recipient) => async (dispatch, getState) => {
  const {wallets, selected} = getState().get('multisigWallet')
  const wallet = wallets.get(selected)
  try {
    const dao: MultisigWalletDAO = wallet.dao()
    await dao.transfer(wallet, token, amount, recipient)
  } catch (e) {
    // eslint-disable-next-line
    console.error('error', e.message)
  }
}
