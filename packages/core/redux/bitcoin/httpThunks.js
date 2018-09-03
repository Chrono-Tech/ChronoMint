/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 */

import type { Dispatch } from 'redux'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import BitcoinMiddlewareService from './BitcoinMiddlewareService'
import { setLatestBlock } from '../tokens/actions'

export const getCurrentBlockHeight = (blockchain) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)

  return BitcoinMiddlewareService.getCurrentBlockHeight({ blockchain, type: network[blockchain] })
    .then(({ data }) => {
      dispatch(setLatestBlock(blockchain, { blockNumber: data.currentBlock }))
      return data
    })
    .catch((error) => {
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getTransactionInfo = () => () => {
  // todo
}

export const getTransactionsList = () => () => {
  // todo
}

export const getAddressInfo = () => () => {
  // todo
}

export const getAddressUTXOS = () => () => {
  // todo
}
