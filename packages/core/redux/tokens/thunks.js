/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ethereumDAO from '../../dao/EthereumDAO'
import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { estimateGas } from '../ethereum/thunks'

import {
  DUCK_TOKENS,
} from './constants'
import {
  BLOCKCHAIN_ETHEREUM,
  ETH,
  EVENT_NEW_BLOCK,
  EVENT_NEW_TOKEN,
} from '../../dao/constants'
import * as TokensActions from './actions'

export const subscribeOnTokens = (callback) => (dispatch, getState) => {
  const handleToken = (token) => dispatch(callback(token))
  tokenService.on(EVENT_NEW_TOKEN, handleToken)
  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(handleToken)
}

export const watchLatestBlock = () => async (dispatch) => {
  ethereumDAO.on(EVENT_NEW_BLOCK, (block) => {
    dispatch(TokensActions.setLatestBlock(BLOCKCHAIN_ETHEREUM, block))
  })
  const block = await ethereumDAO.getBlockNumber()
  dispatch(TokensActions.setLatestBlock(BLOCKCHAIN_ETHEREUM, { blockNumber: block }))
}

export const estimateGasTransfer = (tokenId, params, gasPriceMultiplier = 1, address) => async (dispatch) => {
  const tokenDao = tokenService.getDAO(tokenId)
  const [to, amount] = params
  const tx = tokenDao.transfer(address, to, amount)
  const { gasLimit, gasFee, gasPrice } = await dispatch(estimateGas(tx))

  return {
    gasLimit,
    gasFee: new Amount(gasFee.mul(gasPriceMultiplier).toString(), ETH),
    gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier).toString(), ETH),
  }
}
