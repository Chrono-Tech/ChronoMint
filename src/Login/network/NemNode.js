import axios from 'axios'
import { data as networks } from './nem/lib/Network'
import NewMiddlewareNode from './NemMiddlewareNode'

// TODO @dkchv: update to actual config
const NEM_TESTNET_NODE = new NewMiddlewareNode({
  api: axios.create({
    baseURL: '//middleware-ethereum-testnet-rest.chronobank.io',
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

const NEM_MAINNET_NODE = new NewMiddlewareNode({
  api: axios.create({
    baseURL: '//middleware-ethereum-testnet-rest.chronobank.io',
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

export default function selectNEMNode (engine) {
  return engine.getNetwork() !== networks.Mainnet
    ? NEM_TESTNET_NODE
    : NEM_MAINNET_NODE
}
