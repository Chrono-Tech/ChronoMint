/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { isNil, omitBy } from 'lodash'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { SignerMemoryModel, TxEntryModel, TxExecModel } from '../../models'
import { pendingEntrySelector, web3Selector } from './selectors'
import { DUCK_ETHEREUM, NONCE_UPDATE, TX_CREATE, TX_STATUS, WEB3_UPDATE } from './constants'
import { getSigner } from '../persistAccount/selectors'
import { getBtcFee, getProviderByBlockchain } from '../tokens/utils'
import TokenModel from "../../models/tokens/TokenModel";
import TransferExecModel from "../../models/TransferExecModel";
import Amount from "../../models/Amount";
import { nextNonce, sendSignedTransaction, signTransaction } from "../ethereum/actions";
import { BLOCKCHAIN_ETHEREUM } from "../../dao/constants";
import { showConfirmTransferModal } from "../../../core-dependencies/redux/ui/actions";
import { notifyError } from "../notifier/actions";
import TransferError from "../../models/TransferError";
import { TRANSFER_CANCELLED } from "../../models/constants/TransferError";

export const estimateFee = (from: string, to, amount: BigNumber, feeRate: Number) => async (dispatch, getState) => {

  const node = this._selectNode(this._engine)
  const utxos = await node.getAddressUTXOS(from || this._engine.getAddress())
  const { fee } = this._engine.describeTransaction(to, amount, feeRate, utxos)
  return fee
}

export const createTransaction = (entry) => ({
  type: TX_CREATE,
  entry
})

export const executeTransaction = ({ tx, options = null }) => async (dispatch, getState) => {
  // const entry = new TxEntryModel({
  //   key: uuid(),
  //   tx: tx,
  //   receipt: null,
  //   isSubmitted: true,
  //   isAccepted: false,
  // })
  console.log('before updateTx')

  const updatedTx = await dispatch(prepareTransaction(tx, options))

  console.log('updateTx', updatedTx)
  // dispatch(createTransaction(entry))

  dispatch(submitTransaction(updatedTx))
}

export const prepareTransaction = (tx, {
  feeMultiplier = 1,
  satPerByte = null,
  wallet,
  token,
}) => async (dispatch) => {
  const tokenRate = satPerByte ? satPerByte : feeMultiplier * tx.token.feeRate()

  const fee = await getBtcFee({
    address: tx.from,
    recipient: tx.to,
    amount: tx.value,
    formFee: tokenRate,
    blockchain: wallet.blockchain
  })

  console.log('fee', fee, tx, tokenRate)
  return new TransferExecModel({
    title: `tx.Bitcoin.${wallet.blockchain}.transfer.title`,
    blockchain: wallet.blockchain,
    from: tx.from,
    to: tx.to,
    amount: new Amount(tx.value, token.symbol()),
    amountToken: token,
    fee: new Amount(fee, token.symbol()),
    feeToken: token,
    feeMultiplier,
    options: {
      advancedParams: {
        satPerByte,
      }

    }
  })
}

const submitTransaction = (tx) => async (dispatch) => {
  dispatch(modalsOpen({
    componentName: 'ConfirmTransferDialog',
    props: {
      tx,
      confirm: (tx) => dispatch(acceptTransaction(tx)),
      reject: (tx) => dispatch(rejectTxHandler(tx)),
    },
  }))
}

const acceptTransaction = (tx) => async (dispatch) => {
  const provider = getProviderByBlockchain(tx.blockchain())

  console.log('acceptTransaction', provider, tx.blockchain(), tx.from(), tx.to(), tx.amount(), tx.fee())
  if (provider) {
    provider.transfer(tx.from(), tx.to(), tx.amount(), tx.fee())
  }

}

const rejectTxHandler = (dao, dispatch) => async (tx: TransferExecModel | TxExecModel) => {
  const e = new TransferError('Rejected', TRANSFER_CANCELLED)
  dispatch(notifyError(e, tx.funcTitle()))
}

export const processTransaction = ({ web3, entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  return dispatch(sendSignedTransaction({
    web3,
    entry: pendingEntrySelector(entry.tx.from, entry.key)(getState()),
  }))
}

const rejectTransaction = (entry) => (dispatch) => {
  dispatch({
    type: TX_STATUS,
    key: entry.key,
    address: entry.tx.from,
    props: {
      isRejected: true,
    },
  })
}
