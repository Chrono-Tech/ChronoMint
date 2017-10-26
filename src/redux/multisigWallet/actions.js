import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type WalletNoticeModel from 'models/notices/WalletNoticeModel'
import type MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import type MultisigWalletDAO from 'dao/MultisigWalletDAO'
import type MultisigWalletPendingTxModel from 'models/Wallet/MultisigWalletPendingTxModel'
import { notify } from 'redux/notifier/actions'
import multisigWalletService from 'services/MultisigWalletService'
import TokenModel from 'models/TokenModel'
import { DUCK_SESSION } from 'redux/session/actions'

export const DUCK_MULTISIG_WALLET = 'multisigWallet'

export const MULTISIG_FETCHING = 'multisig/FETCHING'
export const MULTISIG_FETCHED = 'multisig/FETCHED'

export const MULTISIG_UPDATE = 'multisigWallet/UPDATE'
export const MULTISIG_SELECT = 'multisigWallet/SELECT'
export const MULTISIG_REMOVE = 'multisigWallet/REMOVE'

const watchMultisigWallets = (wallet: MultisigWalletModel) => async (dispatch) => {
  try {
    await multisigWalletService.subscribeToWalletDAO(wallet)
  } catch (e) {
    // eslint-disable-next-line
    console.error('watch error', e.message)
  }
}

const handleWalletCreate = (wallet: MultisigWalletModel, notice: WalletNoticeModel) => (dispatch, getState) => {
  dispatch({type: MULTISIG_UPDATE, wallet: wallet.isPending(false)})
  dispatch(notify(notice))
  watchMultisigWallets(wallet)
  const wallets = getState().get(DUCK_MULTISIG_WALLET)
  if (wallets.size === 1) {
    dispatch(selectMultisigWallet(wallets.first()))
  }
}

export const watchWalletManager = () => async (dispatch, getState) => {
  const updateCallback = (wallet: MultisigWalletModel, notice: WalletNoticeModel) => dispatch(handleWalletCreate(wallet, notice))
  const dao = await contractsManagerDAO.getWalletsManagerDAO()
  await dao.watchWalletCreate(updateCallback)

  // TODO @dkchv: !!!
  // multisig wallet events
  multisigWalletService.on('OwnerRemoved', (walletId, result) => {
    console.log('--actions#', result)
  })

  multisigWalletService.on('MultiTransact', (walletId, result) => {
    console.log('--actions#', result)
  })

  multisigWalletService.on('SingleTransact', (walletId, result) => {
    console.log('--actions#', result)
  })

  multisigWalletService.on('ConfirmationNeeded', (walletId, pendingTxModel: MultisigWalletPendingTxModel) => {
    const wallet: MultisigWalletModel = getState().get(DUCK_MULTISIG_WALLET).list().get(walletId)
    const pendingTxList = wallet.pendingTxList()
    dispatch({type: MULTISIG_UPDATE, wallet: wallet.pendingTxList(pendingTxList.set(pendingTxModel.id(), pendingTxModel))})
  })

  multisigWalletService.on('Deposit', (walletId, tokenId, amount) => {
    const wallet: MultisigWalletModel = getState().get(DUCK_MULTISIG_WALLET).list().get(walletId)
    const token: TokenModel = wallet.tokens().get(tokenId)
    const updatedWallet = wallet.tokens(wallet.tokens().set(token.id(), token.updateBalance(true, amount)))
    console.log('--actions#', updatedWallet.toJS())
    dispatch({type: MULTISIG_UPDATE, wallet: updatedWallet})
    // dispatch(notify(notice))
  })
}

export const selectMultisigWallet = (wallet: MultisigWalletModel) => (dispatch) => {
  console.log('--actions#', 1)
  dispatch({type: MULTISIG_SELECT, wallet})
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
    dispatch(selectMultisigWallet(wallets.first()))
  }
}

export const createWallet = (wallet: MultisigWalletModel) => async (dispatch) => {
  try {
    const dao = await contractsManagerDAO.getWalletsManagerDAO()
    const txHash = await dao.createWallet(wallet)
    dispatch({type: MULTISIG_UPDATE, wallet: wallet.isPending(true).transactionHash(txHash)})
  } catch (e) {
    // eslint-disable-next-line
    console.error('create wallet error', e.message)
  }
}

export const removeWallet = (wallet: MultisigWalletModel) => async (dispatch, getState) => {
  try {
    const {account} = getState().get(DUCK_SESSION)
    const dao: MultisigWalletDAO = wallet.dao()
    await dao.removeWallet(wallet, account)
    dispatch({type: MULTISIG_REMOVE, wallet})
  } catch (e) {
    // eslint-disable-next-line
    console.error('delete error', e.message)
  }
}

export const updateWallet = (/*wallet: MultisigWalletModel*/) => (/*dispatch*/) => {
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

export const multisigTransfer = (wallet, token, amount, recipient) => async (dispatch, getState) => {
  try {
    const dao: MultisigWalletDAO = wallet.dao()
    await dao.transfer(wallet, token, amount, recipient)
  } catch (e) {
    // eslint-disable-next-line
    console.error('error', e.message)
  }
}
