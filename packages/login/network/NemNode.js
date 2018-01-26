import axios from 'axios'
import * as NEM from './nem'
import NemMiddlewareNode from './NemMiddlewareNode'

export const NEM_MAINNET_NODE = new NemMiddlewareNode({
  feeRate: 200,
  mosaics: [{
    namespace: 'chronobank:minute',
    name: 'XMIN',
    title: 'Minutes',
    symbol: 'XMIN',
    decimals: 2,
  }],
  api: axios.create({
    baseURL: 'https://test-4.chronobank.io',
    timeout: 8000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/mainnet-nem-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

export const NEM_TESTNET_NODE = new NemMiddlewareNode({
  feeRate: 200,
  mosaics: [{
    namespace: 'cb:minutes',
    name: 'XMIN',
    title: 'Minutes',
    symbol: 'XMIN',
    decimals: 2,
  }],
  api: axios.create({
    baseURL: 'https://test-3.chronobank.io',
    timeout: 8000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/testnet-nem-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

export function selectNemNode (engine) {
  return engine && engine.getNetwork() === NEM.Network.data.Mainnet
    ? NEM_MAINNET_NODE
    : NEM_TESTNET_NODE
}
