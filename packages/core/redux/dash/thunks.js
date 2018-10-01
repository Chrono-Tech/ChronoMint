/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { Address, Transaction } from 'dashcore-lib';
import BigNumber from 'bignumber.js'

import { TransferNoticeModel, TxExecModel } from '../../models'
import { describePendingBitcoinTx } from '../../describers'

import { getToken } from '../tokens/selectors'
import { getSelectedNetwork } from '../persistAccount/selectors'

import { modalsOpen } from '../modals/actions'
import { notify } from '../notifier/actions'

import * as BitcoinActions from '../bitcoin/actions'
import { getAddressUTXOS } from '../bitcoin/thunks'
import * as BitcoinUtils from '../bitcoin/utils'

import { getDashSigner } from './selectors'
import DashMiddlewareService from './DashMiddlewareService'

export const executeDashTransaction = ({ tx, options }) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinExecuteTx())
  try {
    const state = getState()
    const token = getToken(options.symbol)(state)
    const network = getSelectedNetwork()(state)
    const blockchain = token.blockchain()

    const utxosRawData = await dispatch(getAddressUTXOS(tx.from, blockchain))
    const utxos = utxosRawData.map(utxo => new Transaction.UnspentOutput(utxo))

    const transaction = new Transaction()
      .from(utxos)
      .to(Address.fromString(tx.to), tx.value.toNumber())
      .change(Address.fromString(tx.from))

    const transferFee = transaction.getFee()
    transaction.fee(transferFee)

    const signer = getDashSigner(state, blockchain)
    signer.signTransaction(transaction)

    const txExecModel = new TxExecModel({
      from: tx.from,
      to: tx.to,
      amount: new BigNumber(tx.value),
      fee: new BigNumber(transferFee),
    })

    const entry = BitcoinUtils.createBitcoinTxEntryModel({ tx: txExecModel }, options)
    const description = describePendingBitcoinTx(entry, { token })

    dispatch(modalsOpen({
      componentName: 'ConfirmTxDialog',
      props: {
        entry,
        description,
        accept: () => async (dispatch) => {
          const response = await DashMiddlewareService.requestSendTx(transaction, blockchain, network[blockchain])
          dispatch(notify(new TransferNoticeModel({
            value: token.removeDecimals(tx.value),
            symbol: token.symbol(),
            from: tx.from,
            to: tx.to,
          })))
          return dispatch(BitcoinActions.bitcoinExecuteTxSuccess(response.data))
        },
        reject: (entry) => (dispatch) => dispatch(BitcoinActions.bitcoinTxReject(entry)),
      },
    }))

  } catch (error) {
    dispatch(BitcoinActions.bitcoinExecuteTxFailure(error))
  }
}
