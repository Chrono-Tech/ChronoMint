/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from '@chronobank/login/network/constants'

export default {
  [BLOCKCHAIN_BITCOIN]: {
    transfer: {
      title: 'BTC Transfer',
    },
  },
  [BLOCKCHAIN_BITCOIN_CASH]: {
    transfer: {
      title: 'BCC Transfer',
    },
  },
  [BLOCKCHAIN_BITCOIN_GOLD]: {
    transfer: {
      title: 'BTG Transfer',
    },
  },
  [BLOCKCHAIN_LITECOIN]: {
    transfer: {
      title: 'LTC Transfer',
    },
  },
}
