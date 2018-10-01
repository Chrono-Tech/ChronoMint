/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { Address, Transaction } from 'dashcore-lib';

import { getToken } from '../tokens/selectors'
import { getSelectedNetwork } from '../persistAccount/selectors'

import * as BitcoinActions from '../bitcoin/actions'
import { getAddressUTXOS } from '../bitcoin/thunks'

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

    const signer = getDashSigner(state, blockchain)
    signer.signTransaction(transaction);
    DashMiddlewareService.requestSendTx(transaction, blockchain, network[blockchain])
  } catch (error) {
    dispatch(BitcoinActions.bitcoinExecuteTxFailure(error))
  }
}