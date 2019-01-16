/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { updateWalletBalance } from '../ethereum/thunks'
import {
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
} from '../../dao/constants'

export const updateEthWalletBalance = ({ wallet, tx }) => (dispatch) => {
  switch (wallet.blockchain) {
  case BLOCKCHAIN_ETHEREUM:
    dispatch(updateWalletBalance(wallet, tx))
    break
  case BLOCKCHAIN_LABOR_HOUR:
    dispatch(updateWalletBalance(wallet, tx))
    break
  default:
    return
  }
}
