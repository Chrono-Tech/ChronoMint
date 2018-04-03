import axios from 'axios'
import { LOCAL_ID, NETWORK_MAIN_ID } from './settings'
import EthereumMiddlewareNode from './EthereumMiddlewareNode'

// TODO @dkchv: update to actual config
const ETHEREUM_TESTNET_NODE = new EthereumMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-ethereum-testnet-rest.chronobank.io',
    timeout: 4000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/app_testnet-ethereum-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

const ETHEREUM_MAINNET_NODE = new EthereumMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-ethereum-mainnet-rest.chronobank.io',
    timeout: 4000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/app_mainnet-ethereum-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

const ETHEREUM_TESTRPC_NODE = new EthereumMiddlewareNode({
  api: axios.create({
    baseURL: 'http://localhost:8083',
    timeout: 4000,
  }),
  socket: {
    baseURL: 'http://localhost:15674/stomp',
    user: 'guest',
    password: 'guest',
    channels: {
      balance: '/exchange/events/app_testnet-ethereum-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

export default function selectEthereumNode (engine) {
  switch (engine.getNetwork().id) {
    case NETWORK_MAIN_ID :
      return ETHEREUM_MAINNET_NODE
    case LOCAL_ID:
      return ETHEREUM_TESTRPC_NODE
    default:
      return ETHEREUM_TESTNET_NODE
  }
}
