/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { Address, Script, Transaction, Unit } from 'dashcore-lib'
import BigNumber from 'bignumber.js'

import { TransferNoticeModel, TxExecModel } from '../../models'
import { describePendingBitcoinTx } from '../../describers'

import { getToken } from '../tokens/selectors'
import { getSelectedNetwork } from '../persistAccount/selectors'

import { modalsOpen } from '../modals/actions'
import { notify } from '../notifier/actions'

import * as BitcoinActions from '../abstractBitcoin/actions'
import { getAddressUTXOS } from '../abstractBitcoin/thunks'
import * as BitcoinUtils from '../abstractBitcoin/utils'

import { getLitecoinSigner } from './selectors'
import DashMiddlewareService from './LitecoinMiddlewareService'

export const executeLitecoinTransaction = ({ tx, options }) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinExecuteTx())
  try {
    const state = getState()
    const token = getToken(options.symbol)(state)
    const network = getSelectedNetwork()(state)
    const blockchain = token.blockchain()

    const transaction = await getUnsignedTransaction(dispatch, tx.from, tx.to, tx.value.toNumber(), blockchain)
    const transferFee = getTransferFee(transaction, options.feeMultiplier)
    transaction.fee(transferFee)

    const signer = getLitecoinSigner(state)
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
          const response = await DashMiddlewareService.requestSendTx(transaction, blockchain, network[blockchain],
            options.instantSend)
          dispatch(notify(new TransferNoticeModel({
            amount: token.removeDecimals(tx.value),
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
  const utxosRawData = await dispatch(getAddressUTXOS(from, blockchain)) || []

  if (utxosRawData.length < 1) {
    throw new Error(`Can't find utxos for address: ${from}`)
  }

  const utxos = utxosRawData.map((utxo) => {
    utxo.scriptPubKey = Script.fromAddress(utxo.address)
    return new Transaction.UnspentOutput(utxo)
  })

  return new Transaction()
    .from(utxos)
    .to(Address.fromString(to), amount)
    .change(Address.fromString(from))
}

function getTransferFee (transaction, coefficient) {
  return new Unit(coefficient * transaction.getFee(), Unit.satoshis).toSatoshis()
}
