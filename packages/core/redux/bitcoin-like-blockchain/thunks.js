/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type { Dispatch } from 'redux'
import { selectCurrentNetwork } from '@chronobank/nodes/redux/selectors'
import * as BitcoinActions from './actions'

import BitcoinMiddlewareService from './MiddlewareService'

/* eslint-disable-next-line import/prefer-default-export */
export const getAddressUTXOS = (address: string, blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain || !address) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetUtxosFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = selectCurrentNetwork(state)
  const netType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetUtxos())
  return BitcoinMiddlewareService.requestBitcoinAddressUTXOS(address, blockchain, netType)
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetUtxosSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetUtxosFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}
