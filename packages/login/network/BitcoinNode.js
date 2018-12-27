/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BTC,
  BCC,
  DASH,
  LTC,
} from '@chronobank/login/network/constants'
import BitcoinMiddlewareNode from './BitcoinMiddlewareNode'

const BTC_MAINNET_NODE = new BitcoinMiddlewareNode({
  feeRate: 200,
  api: axios.create({
    baseURL: 'https://middleware-bitcoin-mainnet-rest.chronobank.io',
    timeout: 10000,
  }),
  blockchain: BLOCKCHAIN_BITCOIN,
  symbol: BTC,
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/mainnet-bitcoin-middleware-chronobank-io_balance',
      block: '/exchange/events/mainnet-bitcoin-middleware-chronobank-io_block',
    },
  },
  trace: false,
})

export const BTC_TESTNET_NODE = new BitcoinMiddlewareNode({
  feeRate: 200,
  api: axios.create({
    baseURL: 'https://middleware-bitcoin-testnet-rest.chronobank.io',
    timeout: 10000,
  }),
  blockchain: BLOCKCHAIN_BITCOIN,
  symbol: BTC,
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/testnet-bitcoin-middleware-chronobank-io_balance',
      transaction: '/exchange/events/testnet-bitcoin-middleware-chronobank-io_transaction',
      block: '/exchange/events/testnet-bitcoin-middleware-chronobank-io_block',
    },
  },
  trace: true,
})

const BCC_MAINNET_NODE = new BitcoinMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-bcc-mainnet-rest.chronobank.io/',
    timeout: 10000,
  }),
  blockchain: BLOCKCHAIN_BITCOIN_CASH,
  symbol: BCC,
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_balance',
      transaction: '/exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_transaction',
      block: '/exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_block',
    },
  },
  trace: false,
})

const BCC_TESTNET_NODE = new BitcoinMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-bcc-testnet-rest.chronobank.io/',
    timeout: 10000,
  }),
  blockchain: BLOCKCHAIN_BITCOIN_CASH,
  symbol: BCC,
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_balance',
      transaction: '/exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_transaction',
      block: '/exchange/events/internal-testnet-bitcoin-middleware-chronobank-io_block',
    },
  },
  trace: true,
})

const DASH_MAINNET_NODE = new BitcoinMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-dash-mainnet.chronobank.io',
    timeout: 10000,
  }),
  blockchain: BLOCKCHAIN_DASH,
  symbol: DASH,
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/mainnet-dash-middleware-chronobank-io_balance',
      transaction: '/exchange/events/mainnet-dash-middleware-chronobank-io_transaction',
      block: '/exchange/events/mainnet-dash-middleware-chronobank-io_block',
    },
  },
  trace: false,
})

const DASH_TESTNET_NODE = new BitcoinMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-dash-dev.chronobank.io',
    timeout: 10000,
  }),
  blockchain: BLOCKCHAIN_DASH,
  symbol: DASH,
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/testnet-dash-middleware-chronobank-io_balance',
      transaction: '/exchange/events/testnet-dash-middleware-chronobank-io_transaction',
      block: '/exchange/events/testnet-dash-middleware-chronobank-io_block',
    },
  },
  trace: true,
})

export const LTC_MAINNET_NODE = new BitcoinMiddlewareNode({
  feeRate: 900,
  api: axios.create({
    baseURL: 'https://middleware-litecoin-mainnet-rest.chronobank.io',
    timeout: 10000,
  }),
  blockchain: BLOCKCHAIN_LITECOIN,
  symbol: LTC,
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/mainnet-litecoin-middleware-chronobank-io_balance',
      block: '/exchange/events/mainnet-litecoin-middleware-chronobank-io_block',
    },
  },
  trace: true,
})

export const LTC_TESTNET_NODE = new BitcoinMiddlewareNode({
  feeRate: 900,
  api: axios.create({
    baseURL: 'https://middleware-ltc-dev.chronobank.io',
    timeout: 10000,
  }),
  blockchain: BLOCKCHAIN_LITECOIN,
  symbol: LTC,
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/testnet-litecoin-middleware-chronobank-io_balance',
      block: '/exchange/events/testnet-litecoin-middleware-chronobank-io_block',
    },
  },
  trace: false,
})

export function selectBTCNode (network) {
  return network.Bitcoin === 'testnet'
    ? BTC_TESTNET_NODE
    : BTC_MAINNET_NODE
}

export function selectBCCNode (network) {
  return network['Bitcoin Cash'] === 'testnet'
    ? BCC_TESTNET_NODE
    : BCC_MAINNET_NODE
}

export function selectDASHNode (network) {
  return network.Dash === 'testnet'
    ? DASH_TESTNET_NODE
    : DASH_MAINNET_NODE
}

export function selectLTCNode (network) {
  return network.Litecoin === 'litecoin_testnet'
    ? LTC_TESTNET_NODE
    : LTC_MAINNET_NODE
}
