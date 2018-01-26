import axios from 'axios'
import nem from 'nem-sdk'
import NemMiddlewareNode from './NemMiddlewareNode'

export const NEM_MAINNET_NODE = new NemMiddlewareNode({
  mosaics: [{
    definition: {
      creator: 'cb60520c740f867ea01a60e662e833a5f7f9d3070fdf23cdcf903d6abc1cdd52',
      description: 'chronobank bonus minutes',
      id: {
        namespaceId: 'chronobank',
        name: 'minute',
      },
      properties: [
        { name: 'divisibility', value: '2' },
        { name: 'initialSupply', value: '100000' },
        { name: 'supplyMutable', value: 'true' },
        { name: 'transferable', value: 'true' },
      ],
      levy: {},
    },
    namespace: 'cb:minutes',
    decimals: 2,
    name: 'XMIN',
    title: 'Minutes',
    symbol: 'XMIN',
  }],
  api: axios.create({
    baseURL: 'https://middleware-nem-mainnet-rest.chronobank.io',
    timeout: 30000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/mainnet-nem-middleware-chronobank-io_balance',
      transaction: '/exchange/events/mainnet-nem-middleware-chronobank-io_transaction',
    },
  },
  trace: true,
})

export const NEM_TESTNET_NODE = new NemMiddlewareNode({
  mosaics: [{
    definition: {
      creator: 'f445e92ecf24c34a4a62e7855c300e1cd6cd8749d0672eb097ebdd22c9708912',
      description: 'Chronobank bonus minutes',
      id: {
        namespaceId: 'cb',
        name: 'minutes',
      },
      properties: [
        { name: 'divisibility', value: '2' },
        { name: 'initialSupply', value: '1000000' },
        { name: 'supplyMutable', value: 'true' },
        { name: 'transferable', value: 'true' },
      ],
      levy: {},
    },
    namespace: 'cb:minutes',
    decimals: 2,
    name: 'XMIN',
    title: 'Minutes',
    symbol: 'XMIN',
  }],
  api: axios.create({
    baseURL: 'https://middleware-nem-testnet-rest.chronobank.io',
    timeout: 30000,
  }),
  socket: {
    baseURL: 'https://rabbitmq-webstomp.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/internal-testnet-nem-middleware-chronobank-io_balance',
      transaction: '/exchange/events/internal-testnet-nem-middleware-chronobank-io_transaction',
    },
  },
  trace: true,
})

export function selectNemNode (engine) {
  return engine.getNetwork() !== nem.model.network.data.mainnet
    ? NEM_TESTNET_NODE
    : NEM_MAINNET_NODE
}
