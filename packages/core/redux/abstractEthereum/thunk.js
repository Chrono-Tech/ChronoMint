/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { updateWalletBalance } from '../ethereum/thunks'
import {
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
} from '../../dao/constants'

export const updateEthWalletBalance = ({ wallet }) => (dispatch) => {
  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      dispatch(updateWalletBalance(wallet))
      break
    case BLOCKCHAIN_LABOR_HOUR:
      dispatch(updateWalletBalance(wallet))
      break
    default:
      return
  }
}
