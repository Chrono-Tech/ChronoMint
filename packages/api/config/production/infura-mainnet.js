/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_BITCOIN,
  // BLOCKCHAIN_DASH,
  // BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from '../constants'

export default {
  'title': 'Infura - Mainnet (production)',
  'protocol': 'https',
  'name': 'Mainnet (production)',
  'host': 'mainnet.infura.io/PVe9zSjxTKIP3eAuAHFA',
  'ws': 'wss://mainnet.infura.io/ws',
  'blockchains': {
    [BLOCKCHAIN_BITCOIN]: 'bitcoin',
    [BLOCKCHAIN_BITCOIN_CASH]: 'bitcoin',
    [BLOCKCHAIN_BITCOIN_GOLD]: 'bitcoingold',
    [BLOCKCHAIN_LITECOIN]: 'litecoin',
    [BLOCKCHAIN_NEM]: 'mainnet',
    [BLOCKCHAIN_WAVES]: 'MAINNET_CONFIG',
  },
}
