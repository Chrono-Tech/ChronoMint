/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Eos from 'eosjs'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import * as EosActions from './actions'
import * as EosUtils from './utils'
import Amount from '../../models/Amount'
import WalletModel from '../../models/wallet/WalletModel'
import { BLOCKCHAIN_EOS, PAGE_SIZE } from './constants'
import { describePendingEosTx } from '../../describers'
import {
  eosPendingEntrySelector,
  EOSPendingSelector,
  EOSSelector,
  getEosSigner,
  getEOSTokens,
  getEOSWallet,
  getEosWallets,
} from './selectors/mainSelectors'
import { ErrorNoticeModel, TransferNoticeModel } from '../../models'
import { notify } from '../notifier/actions'
import { getSelectedNetwork } from '../persistAccount/selectors'
import TxHistoryModel from '../../models/wallet/TxHistoryModel'
import TokenModel from '../../models/tokens/TokenModel'

const notifyEosTransfer = (entry) => (dispatch) => {
  const { tx: { from, to, quantity } } = entry

  dispatch(notify(new TransferNoticeModel({ amount: quantity, from, to })))
}

const notifyEosError = (e) => notify(new ErrorNoticeModel({ message: e.message }))

const eosTxStatus = (key, address, props) => (dispatch, getState) => {
  const pending = EOSPendingSelector()(getState())
  const scope = pending[address]
  if (!scope) {
    return null
  }
  const entry = scope[key]
  if (!entry) {
    return null
  }

  return dispatch(EosActions.eosTxUpdate(
    key,
    address,
    EosUtils.createEosTxEntryModel({
      ...entry,
      ...props,
    }),
  ))
}

export const executeEosTransaction = (wallet, quantity, to, memo = '') => async (dispatch) => {
  const tx = {
    from: wallet.address,
    quantity,
    to,
    memo,
  }
  const entry = EosUtils.createEosTxEntryModel({ tx })
  await dispatch(EosActions.eosTxCreate(entry))
  dispatch(submitTransaction(entry))
}

const processTransaction = ({ entry }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry }))
  const signedEntry = eosPendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!signedEntry) {
    // eslint-disable-next-line no-console
    console.error('signedEntry is null', entry)
    return // stop execute
  }
  return dispatch(sendSignedTransaction({
    entry: signedEntry,
  }))
}

const signTransaction = ({ entry }) => async (dispatch, getState) => {
  try {
    const state = getState()
    const signer = getEosSigner(state)
    const network = getSelectedNetwork()(state)
    const networkConfig = EosUtils.getEOSNetworkConfig(network[BLOCKCHAIN_EOS])
    const preparedTx = await EosUtils.prepareTransactionToOfflineSign(entry.tx, networkConfig)

    // sign
    const signedTx = await signer.signTransaction(preparedTx)

    dispatch(EosActions.eosTxUpdate(entry.key, entry.tx.from, EosUtils.createEosTxEntryModel({
      ...entry,
      tx: { ...entry.tx },
      signedTx,
    })))

  } catch (error) {
    dispatch(eosTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

const sendSignedTransaction = ({ entry }) => async (dispatch, getState) => {
  const state = getState()
  dispatch(eosTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = eosPendingEntrySelector(entry.tx.from, entry.key)(state)
  if (!entry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return notifyEosError('entry is null') // stop execute
  }

  try {
    const network = getSelectedNetwork()(state)
    const { httpEndpoint, chainId } = EosUtils.getEOSNetworkConfig(network[BLOCKCHAIN_EOS])
    const eos = Eos({ httpEndpoint, chainId }) // create eos for push new signed tx
    eos.pushTransaction(entry.signedTx.transaction, (error, transaction) => {
      if (error) {
        dispatch(eosTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
        return notifyEosError(error)
      }
      dispatch(notifyEosTransfer(entry))
      const { processed, transaction_id } = transaction
      dispatch(EosActions.eosTxUpdate(
        entry.key,
        entry.tx.from,
        EosUtils.createEosTxEntryModel({
          ...entry,
          processed,
          hash: transaction_id,
          isSent: true,
          isMined: true,
        }),
      ))
      dispatch(getAccountBalances(entry.tx.from))
    })
  } catch (error) {
    dispatch(eosTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    return notifyEosError(error)
  }
}

const submitTransaction = (entry) => async (dispatch) => {
  const description = describePendingEosTx(entry)

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

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(eosTxStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))
  const selectedEntry = eosPendingEntrySelector(entry.tx.from, entry.key)(getState())
  return dispatch(processTransaction({
    entry: selectedEntry,
  }))
}

const rejectTransaction = (entry) => (dispatch) => dispatch(eosTxStatus(entry.key, entry.tx.from, { isRejected: true }))

export const initEos = () => async (dispatch) => {
  dispatch(setEos())
  dispatch(createEosWallet())
  dispatch(watchEOS())
}

export const createEosWallet = () => async (dispatch, getState) => {
  const state = getState()
  const eos = EOSSelector(state)
  const signer = getEosSigner(state)
  try {

    const accounts = await eos.getKeyAccounts(signer.keys.owner.pub)
    if (accounts && accounts.account_names[0]) {
      const accountName = accounts.account_names[0]
      dispatch(EosActions.updateWallet(new WalletModel({
        address: accountName,
        blockchain: BLOCKCHAIN_EOS,
        isMain: true,
      })))
      dispatch(getAccountBalances(accountName))
    } else {
      // eslint-disable-next-line no-console
      console.log('EOS account not found')
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

export const getAccountBalances = (account) => async (dispatch, getState) => {
  try {
    const state = getState()
    const eos = EOSSelector(state)
    const tokens = getEOSTokens(state)
    const wallet = getEOSWallet(`${BLOCKCHAIN_EOS }-${account}`)(state)
    const result = await eos.getCurrencyBalance('eosio.token', account)
    if (Array.isArray(result)) {
      const balances = result.reduce((accumulator, balance) => {
        const [value, symbol] = balance.split(' ')

        if (!tokens.item(symbol).isFetched()) {
          dispatch(EosActions.eosTokenUpdate(new TokenModel({ symbol, isFetched: true })))
        }

        return {
          ...accumulator,
          [symbol]: new Amount(value, symbol),
        }
      }, {})

      dispatch(EosActions.updateWallet(new WalletModel({ ...wallet, balances })))
      dispatch(getEOSWalletTransactions(wallet.id))
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw error
  }
}

export const setEos = () => async (dispatch, getState) => {
  try {
    const network = getSelectedNetwork()(getState())
    const { httpEndpoint, chainId } = EosUtils.getEOSNetworkConfig(network[BLOCKCHAIN_EOS])
    const eos = Eos({ httpEndpoint, chainId }) // create eos read-only instance
    dispatch(EosActions.updateEos(eos))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw error
  }
}

export const setEOSWalletName = (walletId, name) => (dispatch, getState) => {
  const wallet = getEOSWallet(walletId)(getState())
  dispatch(EosActions.updateWallet(new WalletModel({ ...wallet, name })))
}

export const getEOSWalletTransactions = (walletId) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getEOSWallet(walletId)(state)
  const eos = EOSSelector(state)
  try {
    const transactionsList = wallet.transactions
    let firstAction = transactionsList.firstAction
    let lastAction = transactionsList.lastAction

    dispatch(EosActions.updateWallet(new WalletModel({
      ...wallet,
      transactions: new TxHistoryModel({ ...wallet.transactions, isLoading: true }),
    })))

    const { actions } = await eos.getActions(wallet.address, firstAction || -1, -PAGE_SIZE)

    const blocks = actions
      .reverse()
      .reduce((accumulator, action) => {
        const block = action.block_num
        const tx = EosUtils.createDescModel(action)

        firstAction = firstAction
          ? Math.min(action.account_action_seq, firstAction)
          : action.account_action_seq

        lastAction = lastAction
          ? Math.max(action.account_action_seq, lastAction)
          : action.account_action_seq

        if (!accumulator.hasOwnProperty(block)) {
          accumulator[block] = {
            transactions: {},
          }
        }

        accumulator[block].transactions[tx.hash] = tx
        return accumulator
      }, { ...wallet.transactions.blocks })

    dispatch(EosActions.updateWallet(new WalletModel({
      ...wallet, transactions: new TxHistoryModel({
        ...wallet.transactions,
        blocks,
        firstAction,
        lastAction,
        endOfList: !firstAction, // 0 || undefined
        isLoading: false,
        isFetching: false,
        isFetched: true,
        isLoaded: true,
      }),
    })))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw error
  }
}

const watchEOS = () => async (dispatch, getState) => {
  const state = getState()
  const eos = EOSSelector(state)

  const wallets = getEosWallets(state)
  Object.values(wallets).forEach(async (wallet) => {
    try {
      const transactions = wallet.transactions
      if (transactions.isFetched) {
        const { actions } = await eos.getActions(wallet.address, wallet.transactions.lastAction + 1, 1)
        const action = actions[0]
        const blocks = transactions.blocks
        if (action) {
          const lastAction = action.account_action_seq
          const block = action.block_num

          if (!blocks.hasOwnProperty(block)) {
            blocks[block] = {
              transactions: {},
            }
          }
          blocks[block].transactions[action.hash] = action

          dispatch(EosActions.updateWallet(
            new WalletModel({
              ...wallet,
              transactions: new TxHistoryModel({
                ...wallet.transactions,
                blocks,
                lastAction,
              }),
            }),
          ))

        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    setTimeout(() => {
      dispatch(watchEOS())
    }, 5000)
  })
}
