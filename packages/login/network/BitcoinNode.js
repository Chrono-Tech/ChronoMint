import axios from 'axios'
import { networks } from 'bitcoinjs-lib'
import BitcoinBlockexplorerNode from './BitcoinBlockexplorerNode'
import BitcoinMiddlewareNode from './BitcoinMiddlewareNode'

const BTC_MAINNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://blockexplorer.com/api/',
    timeout: 4000,
  }),
  trace: false,
})

export const BTC_TESTNET_NODE = new BitcoinMiddlewareNode({
  feeRate: 10,
  api: axios.create({
    baseURL: 'https://middleware-bitcoin-testnet-rest.chronobank.io',
    timeout: 4000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/app_testnet-bitcoin-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

const BCC_MAINNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://bitcoincash.blockexplorer.com/api/',
    timeout: 4000,
  }),
  trace: false,
})

const BCC_TESTNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://tbcc.blockdozer.com/insight-api/',
    timeout: 4000,
  }),
  trace: true,
})

const BTG_MAINNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://btgexplorer.com/api',
    timeout: 4000,
  }),
  trace: false,
})

const BTG_TESTNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://testnet.btgexplorer.com/api',
    timeout: 4000,
  }),
  trace: false,
})

// const LTC_MAINNET_NODE = new BitcoinBlockexplorerNode({
//   api: axios.create({
//     baseURL: 'https://insight.litecore.io/api',
//     // Only http API available
//     // baseURL: 'http://explorer.litecointools.com',
//     timeout: 4000,
//   }),
//   trace: false,
// })

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
      balance: '/exchange/events/app_mainnet-litecoin-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

export const LTC_TESTNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://testnet.litecore.io/api',
    timeout: 4000,
  }),
  trace: false,
})

export function selectBTCNode (engine) {
  return engine.getNetwork() === networks.testnet
    ? BTC_TESTNET_NODE
    : BTC_MAINNET_NODE
}

export function selectBCCNode (engine) {
  return engine.getNetwork() === networks.testnet
    ? BCC_TESTNET_NODE
    : BCC_MAINNET_NODE
}

export function selectBTGNode (engine) {
  return engine.getNetwork() === networks.bitcoingold_testnet
    ? BTG_TESTNET_NODE
    : BTG_MAINNET_NODE
}

export function selectLTCNode (engine) {
  return engine.getNetwork() === networks.litecoin_testnet
    ? LTC_TESTNET_NODE
    : LTC_MAINNET_NODE
}
