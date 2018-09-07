/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'

// eslint-disable-next-line import/prefer-default-export
export const addressInfo = (response) => {
  if (response.config.host === 'https://tbcc.blockdozer.com/insight-api') {
    const confirmedBalance = response.confirmedBalance.data
    const unconfirmedBalance = response.unconfirmedBalance.data
    const result = {
      balance0: new BigNumber(confirmedBalance).plus(unconfirmedBalance),
      balance3: new BigNumber(confirmedBalance),
      balance6: new BigNumber(confirmedBalance),
    }
    return result.balance0 || result.balance6
  } else {
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
}
