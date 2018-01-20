import axios from 'axios'
import nem from 'nem-sdk'
import NemMiddlewareNode from './NemMiddlewareNode'

export const NEM_MAINNET_NODE = new NemMiddlewareNode({
  feeRate: 200,
  mosaics: [{
    // namespace: 'chronobank:minute',
    // name: 'XMIN',
    // title: 'Minutes',
    // symbol: 'XMIN',
    // decimals: 2,
  }],
  api: axios.create({
    baseURL: 'https://test-4.chronobank.io',
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
  feeRate: 200,
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
    baseURL: 'https://test-5.chronobank.io',
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
