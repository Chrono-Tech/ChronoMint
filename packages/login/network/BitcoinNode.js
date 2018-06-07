/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import { networks } from 'bitcoinjs-lib'
import BitcoinBlockexplorerNode from './BitcoinBlockexplorerNode'
import BitcoinMiddlewareNode from './BitcoinMiddlewareNode'

const BTC_MAINNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://middleware-bitcoin-mainnet-rest.chronobank.io',
    timeout: 4000,
  }),
  trace: false,
})

export const BTC_TESTNET_NODE = new BitcoinMiddlewareNode({
  feeRate: 200,
  api: axios.create({
    baseURL: 'https://middleware-bitcoin-testnet-rest.chronobank.io',
    timeout: 4000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/testnet-bitcoin-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

const BCC_MAINNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://bitcoincash.blockexplorer.com/api',
    timeout: 4000,
  }),
  trace: false,
})

const BCC_TESTNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://tbcc.blockdozer.com/insight-api',
    timeout: 4000,
  }),
  trace: true,
})

const BTG_MAINNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://explorer.bitcoingold.org/insight-api',
    timeout: 4000,
  }),
  trace: false,
})

const BTG_TESTNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://test-explorer.bitcoingold.org/insight-api',
    timeout: 4000,
  }),
  trace: false,
})

export const LTC_MAINNET_NODE = new BitcoinMiddlewareNode({
  feeRate: 900,
  api: axios.create({
    baseURL: 'https://middleware-litecoin-mainnet-rest.chronobank.io',
    timeout: 4000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/mainnet-litecoin-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

export const LTC_TESTNET_NODE = new BitcoinMiddlewareNode({
  feeRate: 900,
  api: axios.create({
    baseURL: 'https://middleware-litecoin-testnet-rest.chronobank.io',
    timeout: 4000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/testnet-litecoin-middleware-chronobank-io_balance',
    },
  },
  trace: false,
})

export function selectBTCNode (engine) {
  return engine.getNetwork() !== networks.bitcoin
    ? BTC_TESTNET_NODE
    : BTC_MAINNET_NODE
}

export function selectBCCNode (engine) {
  return engine.getNetwork() !== networks.bitcoin
    ? BCC_TESTNET_NODE
    : BCC_MAINNET_NODE
}

export function selectBTGNode (engine) {
  return engine.getNetwork() !== networks.bitcoingold
    ? BTG_TESTNET_NODE
    : BTG_MAINNET_NODE
}

export function selectLTCNode (engine) {
  return engine.getNetwork() !== networks.litecoin
    ? LTC_TESTNET_NODE
    : LTC_MAINNET_NODE
}
