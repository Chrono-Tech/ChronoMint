/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { estimateGas as estimateEthereumGas } from '../ethereum/thunks'
import { estimateLaborHourGas } from '../laborHour/thunks'

export const estimateGasTransfer = (tokenId, params, gasPriceMultiplier = 1, address) => {
  return estimateAbstractEthereumGasTransfer(tokenId, params, gasPriceMultiplier, address, estimateEthereumGas)
}

export const estimateLaborHourGasTransfer = (tokenId, params, gasPriceMultiplier = 1, address) => {
  return estimateAbstractEthereumGasTransfer(tokenId, params, gasPriceMultiplier, address, estimateLaborHourGas)
}

const estimateAbstractEthereumGasTransfer = (tokenId, params, gasPriceMultiplier = 1, address, estimateGas) => async (dispatch) => {
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
