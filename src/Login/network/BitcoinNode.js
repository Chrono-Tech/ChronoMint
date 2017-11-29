import axios from 'axios'
import { networks } from 'bitcoinjs-lib'
import BitcoinBlockexplorerNode from './BitcoinBlockexplorerNode'
import BitcoinMiddlewareNode from './BitcoinMiddlewareNode'

const BTC_MAINNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: '//blockexplorer.com/api/',
    timeout: 4000,
  }),
  trace: false,
})

export const BTC_TESTNET_NODE = new BitcoinMiddlewareNode({
  api: axios.create({
    baseURL: '//middleware-bitcoin-testnet-rest.chronobank.io',
    timeout: 4000,
  }),
  socket: {
    baseURL: '//rabbitmq-webstomp.chronobank.io/stomp',
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
    baseURL: '//bitcoincash.blockexplorer.com/api/',
    timeout: 4000,
  }),
  trace: false,
})

const BCC_TESTNET_NODE = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: '//tbcc.blockdozer.com/insight-api/',
    timeout: 4000,
  }),
  trace: true,
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
