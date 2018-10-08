/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { DUCK_NODES } from '../../../redux/constants'

export const requestBitcoinCashUnconfirmedBalance = (address) => (dispatch, getState) => {
  const state = getState()
  const client = state.get(DUCK_NODES).networkType === 'mainnet'
    ? 'bcc_blockdozer'
    : 'tbcc_blockdozer'
  const action = {
    type: 'REQ/POST/BLOCKDOZER/UNCONFIRMEDBALANCE',
    payload: {
      client,
      request: {
        method: 'GET',
        url: `/addr/${address}/unconfirmedBalance`,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

export const requestBitcoinCashConfirmedBalance = (address) => (dispatch, getState) => {
  const state = getState()
  const client = state.get(DUCK_NODES).networkType === 'mainnet'
    ? 'bcc_blockdozer'
    : 'tbcc_blockdozer'
  const action = {
    type: 'REQ/POST/BLOCKDOZER/CONFIRMEDBALANCE',
    payload: {
      client,
      request: {
        method: 'GET',
        url: `/addr/${address}/confirmedBalance`,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

export const requestBitcoinCashAddressInfo = (address) => async (dispatch) => {
  try {
    const [confirmedBalance, unconfirmedBalance] = await Promise.all([
      await dispatch(requestBitcoinCashConfirmedBalance(address)),
      await dispatch(requestBitcoinCashUnconfirmedBalance(address)),
    ])

    const result = {
      balance0: new BigNumber(confirmedBalance).plus(unconfirmedBalance),
      balance3: new BigNumber(confirmedBalance),
      balance6: new BigNumber(confirmedBalance),
    }
    return result.balance0 || result.balance6
  } catch (error) {
    throw new Error(error)
  }
}
