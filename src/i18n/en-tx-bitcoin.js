/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from '@chronobank/core/dao/constants'

export default {
  [BLOCKCHAIN_BITCOIN]: {
    transfer: {
      title: 'BTC Transfer',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      fee: 'Fee',
    },
  },
  [BLOCKCHAIN_BITCOIN_CASH]: {
    transfer: {
      title: 'BCC Transfer',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      fee: 'Fee',
    },
  },
  [BLOCKCHAIN_BITCOIN_GOLD]: {
    transfer: {
      title: 'BTG Transfer',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      fee: 'Fee',
    },
  },
  [BLOCKCHAIN_LITECOIN]: {
    transfer: {
      title: 'LTC Transfer',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      fee: 'Fee',
    },
  },
}
