import contractsManagerDAO from 'dao/ContractsManagerDAO'
import type WalletNoticeModel from 'models/notices/WalletNoticeModel'
import type MultisigWalletModel from 'models/Wallet/MultisigWalletModel'
import type MultisigWalletDAO from 'dao/MultisigWalletDAO'
import type MultisigWalletPendingTxModel from 'models/Wallet/MultisigWalletPendingTxModel'
import { notify } from 'redux/notifier/actions'
import multisigWalletService from 'services/MultisigWalletService'
import TokenModel from 'models/TokenModel'

export const MULTISIG_FETCHING = 'multisig/FETCHING'
export const MULTISIG_FETCHED = 'multisig/FETCHED'

export const MULTISIG_UPDATE = 'multisigWallet/UPDATE'
export const MULTISIG_UPDATE_TOKEN = 'multisigWallet/UPDATE_TOKEN'
export const MULTISIG_SELECT = 'multisigWallet/SELECT'
export const MULTISIG_REMOVE = 'multisigWallet/REMOVE'

const handleWPendingTxUpdate = (id: string, pendingTx: MultisigWalletPendingTxModel, notice: WalletNoticeModel) => (dispatch, getState) => {
  const wallet = getState().get('multisigWallet').list().get(id)
  let pendingTxList = wallet.pendingTxList().set(pendingTx.id(), pendingTx)
  dispatch({type: MULTISIG_UPDATE, wallet: wallet.pendingTxList(pendingTxList)})
  dispatch(notify(notice))
}

const watchMultisigWallets = (wallet: MultisigWalletModel) => async (dispatch) => {
  const callbackPendingTxUpdate = (id: string, pendingTx: MultisigWalletPendingTxModel, notice: WalletNoticeModel) => dispatch(handleWPendingTxUpdate(id, pendingTx, notice))

  try {
    await multisigWalletService.subscribeToWalletDAO(wallet.address())

    const dao = await multisigWalletService.getWalletDAO(wallet.address())

    await Promise.all([
      dao.watchOwnerRemoved(),
      // dao.watchConfirmationNeeded(wallet.id(), callbackPendingTxUpdate),
      dao.watchMultiTransact(),
      dao.watchSingleTransact(),
      // dao.watchDeposit()
    ])

  } catch (e) {
    // eslint-disable-next-line
    console.error('watch error', e.message)
  }
}

const handleWalletCreate = (wallet: MultisigWalletModel, notice: WalletNoticeModel) => (dispatch, getState) => {
  dispatch({type: MULTISIG_UPDATE, wallet: wallet.isPending(false)})
  dispatch(notify(notice))
  watchMultisigWallets(wallet)
  const wallets = getState().get('multisigWallet')
  if (wallets.size === 1) {
    dispatch(selectWallet(wallets.first().id()))
  }
}

export const watchWalletManager = () => async (dispatch, getState) => {
  const updateCallback = (wallet: MultisigWalletModel, notice: WalletNoticeModel) => dispatch(handleWalletCreate(wallet, notice))
  const dao = await contractsManagerDAO.getWalletsManagerDAO()
  await dao.watchWalletCreate(updateCallback)

  // TODO @dkchv: !!!
  multisigWalletService.on('ConfirmationNeeded', (walletId, pendingTxModel: MultisigWalletPendingTxModel) => {
    const wallet: MultisigWalletModel = getState().get('multisigWallet').list().get(walletId)
    const pendingTxList = wallet.pendingTxList()
    dispatch({type: MULTISIG_UPDATE, wallet: wallet.pendingTxList(pendingTxList.set(pendingTxModel.id(), pendingTxModel))})
    console.log('--actions#', 5555, result)
  })
  multisigWalletService.on('Deposit', (walletId, tokenId, amount) => {
    const wallet: MultisigWalletModel = getState().get('multisigWallet').list().get(walletId)
    const token: TokenModel = wallet.tokens().get(tokenId)
    const updatedWallet = wallet.tokens().set(token.id(), token.updateBalance(true, amount))
    dispatch({type: MULTISIG_UPDATE, wallet: updatedWallet})
  })

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
    const {account} = getState().get('session')
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

export const multisigTransfer = (token, amount, recipient) => async (dispatch, getState) => {
  const wallet = getState().get('multisigWallet').selected()
  try {
    const dao: MultisigWalletDAO = wallet.dao()
    await dao.transfer(wallet, token, amount, recipient)
  } catch (e) {
    // eslint-disable-next-line
    console.error('error', e.message)
  }
}
