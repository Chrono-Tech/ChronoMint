/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'

import { BLOCKCHAIN_BITCOIN_CASH } from '../../dao/constants'

/* eslint-disable-next-line import/prefer-default-export */
export const getBalanceDataParser = (blockchain, netType) => {
  // condition for blockdozer
  if (blockchain === BLOCKCHAIN_BITCOIN_CASH && netType === 'testnet' && 0) {
    return parseBitcoinCashBalanceData
  }

  return parseByDefaultBitcoinLikeBlockchainBalanceData
}

const parseBitcoinCashBalanceData = (response) => {
  const confirmedBalance = response.confirmedBalance.data
  const unconfirmedBalance = response.unconfirmedBalance.data
  const result = {
    balance0: new BigNumber(confirmedBalance).plus(unconfirmedBalance),
    balance3: new BigNumber(confirmedBalance),
    balance6: new BigNumber(confirmedBalance),
  }
  return result.balance0 || result.balance6
}

// eslint-disable-next-line import/prefer-default-export
const parseByDefaultBitcoinLikeBlockchainBalanceData = (response) => {
  const {
    confirmations0,
    confirmations3,
    confirmations6,
  } = response.data
  const result =  {
    balance0: new BigNumber(confirmations0.satoshis),
    balance3: new BigNumber(confirmations3.satoshis),
    balance6: new BigNumber(confirmations6.satoshis),
  }
  return result.balance0 || result.balance6
}
