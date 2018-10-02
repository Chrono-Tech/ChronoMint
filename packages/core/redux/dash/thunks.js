/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { Address, Transaction, Unit } from 'dashcore-lib';
import BigNumber from 'bignumber.js'

import { TransferNoticeModel, TxExecModel } from '../../models'
import { describePendingBitcoinTx } from '../../describers'

import { getToken } from '../tokens/selectors'
import { getSelectedNetwork } from '../persistAccount/selectors'

import { modalsOpen } from '../modals/actions'
import { notify } from '../notifier/actions'

import * as BitcoinActions from '../bitcoin-like-blockchain/actions'
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

    const transaction = await getUnsignedTransaction(dispatch, tx.from, tx.to, tx.value.toNumber(), blockchain)
    const transferFee = getTransferFee(transaction, options.feeMultiplier)
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
        reject: (entry) => (dispatch) => dispatch(BitcoinActions.bitcoinTxReject({ tx: entry, blockchain })),
      },
    }))

  } catch (error) {
    dispatch(BitcoinActions.bitcoinExecuteTxFailure(error))
  }
}

export const estimateFee = (params) => async (dispatch) => {
  const { address, recipient, amount, formFee, blockchain } = params
  const transaction = await getUnsignedTransaction(dispatch, address, recipient, amount.toNumber(), blockchain)
  return getTransferFee(transaction, formFee / 200)
}

async function getUnsignedTransaction (dispatch, from, to, amount, blockchain) {
  const utxosRawData = await dispatch(getAddressUTXOS(from, blockchain))
  const utxos = utxosRawData.map(utxo => new Transaction.UnspentOutput(utxo))

  if (!utxosRawData) {
    throw new Error('Can\'t find utxos for address: ', from)
  }

  return new Transaction()
    .from(utxos)
    .to(Address.fromString(to), amount)
    .change(Address.fromString(from))
}

function getTransferFee (transaction, coefficient) {
  return new Unit(coefficient * transaction.getFee(), Unit.satoshis).toSatoshis()
}
