/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { estimateGas as estimateEthereumGas } from '../ethereum/thunks'
import { estimateLaborHourGas } from '../laborHour/thunks'
import { EVENT_NEW_TOKEN } from '../../dao/constants'

import {
  DUCK_TOKENS,
} from './constants'

export const subscribeOnTokens = (callback) => (dispatch, getState) => {
  const handleToken = (token) => dispatch(callback(token))
  tokenService.on(EVENT_NEW_TOKEN, handleToken)
  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(handleToken)
}

export const estimateGasTransfer = (tokenId, params, gasPriceMultiplier = 1, address) => (
  estimateAbstractEthereumGasTransfer(tokenId, params, gasPriceMultiplier, address, estimateEthereumGas)
)

export const estimateLaborHourGasTransfer = (tokenId, params, gasPriceMultiplier = 1, address) => (
  estimateAbstractEthereumGasTransfer(tokenId, params, gasPriceMultiplier, address, estimateLaborHourGas)
)

const estimateAbstractEthereumGasTransfer = (tokenId, params, gasPriceMultiplier = 1, address, estimateGas) => (
  async (dispatch) => {
    const tokenDao = tokenService.getDAO(tokenId)
    const [to, amount] = params
    const tx = tokenDao.transfer(address, to, amount)
    const { gasLimit, gasFee, gasPrice } = await dispatch(estimateGas(tx))

    return {
      gasLimit,
      gasFee: new Amount(gasFee.mul(gasPriceMultiplier).toString(), tokenDao.getSymbol()),
      gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier).toString(), tokenDao.getSymbol()),
    }
  }
)
