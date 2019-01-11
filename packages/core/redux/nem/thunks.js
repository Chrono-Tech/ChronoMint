/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { nemProvider } from '@chronobank/login/network/NemProvider'
import { BLOCKCHAIN_NEM } from '@chronobank/login/network/constants'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import TokenModel from '../../models/tokens/TokenModel'
import Amount from '../../models/Amount'
import { subscribeOnTokens } from '../tokens/thunks'
import { modalsOpen } from '../../redux/modals/actions'
import { ErrorNoticeModel, TransferNoticeModel } from '../../models'
import { nemPendingSelector, pendingEntrySelector, getNemSigner } from './selectors'
import { getSelectedNetwork, getAddressCache } from '../persistAccount/selectors'
import { describePendingNemTx } from '../../describers'
import { getAccount } from '../session/selectors/models'
import * as NemActions from './actions'
import * as NemUtils from './utils'
import { getToken } from '../tokens/selectors'
import { notify } from '../notifier/actions'
import tokenService from '../../services/TokenService'
import { DUCK_PERSIST_ACCOUNT, WALLETS_CACHE_ADDRESS } from '../persistAccount/constants'
import { showSignerModal, closeSignerModal } from '../modals/thunks'

import * as TokensActions from '../tokens/actions'
import WalletModel from '../../models/wallet/WalletModel'

import { NEM_DECIMALS, NEM_XEM_NAME, NEM_XEM_SYMBOL } from '../../dao/constants/NemDAO'
import NemDAO from '../../dao/NemDAO'
import {
  WALLETS_SET,
  WALLETS_UNSET,
  WALLETS_UPDATE_BALANCE,
} from '../wallets/constants'
import { getWalletsByBlockchain } from '../wallets/selectors/models'

const notifyNemTransfer = (entry) => (dispatch, getState) => {
  const { tx } = entry
  const { prepared } = tx
  const token = getToken(entry.symbol)(getState())

  const amount = prepared.mosaics
    ? prepared.mosaics[0].quantity  // we can send only one mosaic
    : prepared.amount

  dispatch(notify(new TransferNoticeModel({
    amount: token.removeDecimals(amount),
    symbol: token.symbol(),
    from: entry.tx.from,
    to: entry.tx.to,
  })))
}

const notifyNemError = (e) => notify(new ErrorNoticeModel({ message: e.message }))

const nemTxStatus = (key, address, props) => (dispatch, getState) => {
  const pending = nemPendingSelector()(getState())
  const scope = pending[address]
  if (!scope) {
    return null
  }
  const entry = scope[key]
  if (!entry) {
    return null
  }

  return dispatch(NemActions.nemTxUpdate(
    key,
    address,
    NemUtils.createNemTxEntryModel({
      ...entry,
      ...props,
    }),
  ))
}

export const estimateNemFee = (params) => async (dispatch) => {
  const { from, to, amount } = params
  const nemDao = tokenService.getDAO(amount.symbol())
  const tx = nemDao.transfer(from, to, amount)
  const preparedTx = await dispatch(prepareTransaction({ tx }))

  return NemUtils.formatFee(preparedTx.prepared.fee)
}

export const executeNemTransaction = ({ tx, options }) => async (dispatch) => {
  dispatch(NemActions.nemExecuteTx({ tx, options }))
  const prepared = await dispatch(prepareTransaction({ tx, options }))
  const entry = NemUtils.createNemTxEntryModel({ tx: prepared }, options)

  await dispatch(NemActions.nemTxCreate(entry))
  dispatch(submitTransaction(entry))
}

const prepareTransaction = ({ tx }) => async (dispatch, getState) => {
  dispatch(NemActions.nemPrepareTx({ tx }))

  const network = getSelectedNetwork()(getState())
  return tx.mosaicDefinition
    ? NemUtils.describeMosaicTransaction(tx, network)
    : NemUtils.describeXemTransaction(tx, network)
}

const processTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  dispatch(NemActions.nemProcessTx({ entry, signer }))

  await dispatch(signTransaction({ entry, signer }))
  const signedEntry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!signedEntry) {
    // eslint-disable-next-line no-console
    console.error('signedEntry is null', entry)
    return // stop execute
  }
  return dispatch(sendSignedTransaction({
    entry: signedEntry,
  }))
}

const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  try {
    const state = getState()
    const { network } = getCurrentNetworkSelector(state)
    const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)
    const { accountIndex } = selectedWallet.encrypted[0]
    const nemPath = NemUtils.getNemDerivedPath(network[BLOCKCHAIN_NEM], accountIndex)
    const addressCache = { ...getAddressCache(state) }

    dispatch(NemActions.nemTxSignTransaction({ entry, signer }))

    dispatch(showSignerModal())
    const { tx } = entry
    const signed = await NemUtils.createXemTransaction(tx.prepared, signer, nemPath, addressCache[BLOCKCHAIN_NEM].address)
    dispatch(closeSignerModal())

    dispatch(NemActions.nemTxUpdate(entry.key, entry.tx.from, NemUtils.createNemTxEntryModel({
      ...entry,
      tx: {
        ...entry.tx,
        signed,
      },
    })))

  } catch (error) {
    dispatch(closeSignerModal())

    dispatch(NemActions.nemTxSignTransactionError({ error }))
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

const sendSignedTransaction = ({ entry }) => async (dispatch, getState) => {

  dispatch(NemActions.nemTxSendSignedTransaction({ entry }))
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!entry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  const node = nemProvider.getNode()
  const res = await node.send({ ...entry.tx.signed.tx, fee: entry.tx.signed.fee }) || {}

  if (res.meta && res.meta.hash) {
    const hash = res.meta.hash.data
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isSent: true, isMined: true, hash }))
    dispatch(notifyNemTransfer(entry))
  }

  if (res.code === 0) {
    dispatch(NemActions.nemTxSendSignedTransactionError({ entry, res }))
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error: res.message }))
    dispatch(notifyNemError(res))
  }
}

const submitTransaction = (entry) => async (dispatch, getState) => {
  dispatch(NemActions.nemSubmitTx({ entry }))

  const state = getState()
  const account = getAccount(state)

  const description = describePendingNemTx(
    entry,
    {
      address: account,
      token: getToken(entry.symbol)(state),
    })

  dispatch(modalsOpen({
    componentName: 'ConfirmTxDialog',
    props: {
      entry,
      description,
      accept: acceptTransaction,
      reject: rejectTransaction,
    },
  }))
}

export const updateWalletBalance = (wallet) => (dispatch) => {
  const updateBalance = (token: TokenModel) => async () => {
    if (token.blockchain() === wallet.blockchain) {
      const dao = tokenService.getDAO(token)
      const balance = await dao.getAccountBalance(wallet.address)

      if (balance) {
        dispatch({ type: WALLETS_UPDATE_BALANCE, walletId: wallet.id, balance: new Amount(balance, token.symbol(), true) })
      }
    }
  }
  dispatch(subscribeOnTokens(updateBalance))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(NemActions.nemTxAccept(entry))
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

  const state = getState()
  const signer = getNemSigner(state)

  const selectedEntry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!selectedEntry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return
  }

  return dispatch(processTransaction({
    entry: selectedEntry,
    signer,
  }))
}

const rejectTransaction = (entry) => (dispatch) => {
  dispatch(NemActions.nemRejectTx({ entry }))
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isRejected: true }))
}

export const enableNem = () => async (dispatch) => {
  await dispatch(initToken())
  await dispatch(initWalletFromKeys())
  nemProvider.connectCurrentNode()
}

const initToken = () => async (dispatch) => {
  const dao = new NemDAO(NEM_XEM_NAME, NEM_XEM_SYMBOL, nemProvider, NEM_DECIMALS)
  dao.watch()

  const nem = await dao.fetchToken()
  await dispatch(initMosaicTokens(nem))
  tokenService.registerDAO(nem, dao)
  dispatch(TokensActions.tokenFetched(nem))
}

export const initMosaicTokens = (nem: TokenModel) => async (dispatch) => {
  const mosaics = nemProvider.getMosaics()
  // do not wait until initialized, it is ok to lazy load all the tokens
  return Promise.all(
    mosaics
      .map((m) => new NemDAO(m.name, m.symbol, nemProvider, m.decimals, m.definition, nem))
      .map(async (dao) => {
        try {
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch(TokensActions.tokenFetched(token))
        } catch (e) {
          dispatch(TokensActions.tokensLoadingFailed())
        }
      }),
  )
}

const initWalletFromKeys = () => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const addressCache = { ...getAddressCache(state) }
  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)
  const { accountIndex } = selectedWallet.encrypted[0]

  if (!addressCache[BLOCKCHAIN_NEM]) {
    const path = NemUtils.getNemDerivedPath(network[BLOCKCHAIN_NEM], accountIndex)
    const signer = getNemSigner(state, path)

    if (signer) {
      const address = await signer.getAddress(path)

      addressCache[BLOCKCHAIN_NEM] = {
        address,
        path,
      }

      dispatch({
        type: WALLETS_CACHE_ADDRESS,
        blockchain: BLOCKCHAIN_NEM,
        address,
        path,
      })
    }
  }

  const { address, path } = addressCache[BLOCKCHAIN_NEM]
  const wallet = new WalletModel({
    address,
    blockchain: BLOCKCHAIN_NEM,
    isMain: true,
    walletDerivedPath: path,
  })

  nemProvider.subscribe(wallet.address)
  dispatch({ type: WALLETS_SET, wallet })

  dispatch(updateWalletBalance(wallet))
}

export const disableNem = () => async (dispatch, getState) => {
  const wallets = getWalletsByBlockchain(BLOCKCHAIN_NEM)(getState())
  wallets.forEach((wallet) => {
    nemProvider.unsubscribe(wallet.address)
    dispatch({ type: WALLETS_UNSET, wallet })
  })
  nemProvider.disconnectCurrentNode()
}

