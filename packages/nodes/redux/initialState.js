/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * TODO: To use i18n for sections/networks titles
 */

const MAINNET = 'mainnet'
const TESTNET = 'testnet'

/**
 * This is map of axios.clients' names, used by redux-axios-middleware
 */
const availableChronoBankMiddlewares = {
  [MAINNET]: {
    'Bitcoin Cash': 'bcc_blockdozer',
    'Bitcoin Gold': 'btgexplorer',
    'Bitcoin': 'middleware_bitcoin_mainnet_rest',
    'Ethereum': 'middleware_ethereum_mainnet_rest',
    'Litecoin': 'middleware_litecoin_mainnet_rest',
    'NEM': 'middleware_nem_mainnet_rest',
    'WAVES': 'middleware_waves_mainnet_rest',
  },
  [TESTNET]: {
    'Bitcoin Cash': 'bcc_blockdozer',
    'Bitcoin Gold': 'btgexplorer',
    'Bitcoin': 'middleware_bitcoin_mainnet_rest',
    'Ethereum': 'middleware_ethereum_mainnet_rest',
    'Litecoin': 'middleware_litecoin_mainnet_rest',
    'NEM': 'middleware_nem_mainnet_rest',
    'WAVES': 'middleware_waves_mainnet_rest',
  },
}

/**
 * This is a list of all available primary Ethereum nodes
 */
const INFURA_TOKEN = 'PVe9zSjxTKIP3eAuAHFA'
const availablePrimaryNodes = {
  [MAINNET]: {
    chronobank: {
      disabled: false,
      host: 'https://mainnet-full-parity-rpc.chronobank.io',
      providerTitle: 'Chronobank',
      status: null,
      ws: 'wss://mainnet-full-geth-ws.chronobank.io',
    },
    infura: {
      disabled: false,
      host: `https://mainnet.infura.io/${INFURA_TOKEN}`,
      providerTitle: 'Infura',
      status: null,
      ws: 'wss://mainnet.infura.io/ws',
    },
  },
  [TESTNET]: {
    chronobank: {
      disabled: false,
      host: 'rinkeby-full-geth-rpc.chronobank.io',
      providerTitle: 'Chronobank',
      status: null,
      ws: 'wss://rinkeby-full-geth-ws.chronobank.io',
    },
    infura: {
      disabled: false,
      host: `https://rinkeby.infura.io/${INFURA_TOKEN}`,
      providerTitle: 'Infura',
      status: null,
      ws: 'wss://rinkeby.infura.io/ws',
    },
  },
  custom: {},
}

export default {
  displaySections: [
    {
      sectionTitle: 'Production Networks',
      sectionDescription: 'Manage your funds',
      networks: [
        {
          networkId: 1,
          networkIndex: 0,
          networkTitle: 'ChronoBank - Mainnet (production)',
        },
        {
          networkId: 1,
          networkIndex: 1,
          networkTitle: 'Infura - Mainnet (production)',
        },
      ],
    },
    {
      sectionTitle: 'Test Networks',
      sectionDescription: 'Test networks with fake funds',
      networks: [
        {
          networkId: 4,
          networkIndex: 2,
          networkTitle: 'ChronoBank - Rinkeby (testnet)',

        },
        {
          networkId: 4,
          networkIndex: 3,
          networkTitle: 'Infura - Rinkeby (testnet)',
        },
      ],
    },
  ],
  availableNetworks: [
    {
      chronobankMiddlewares: availableChronoBankMiddlewares[MAINNET],
      networkId: 1,
      networkIndex: 0,
      networkTitle: 'ChronoBank - Mainnet (production)',
      networkType: MAINNET,
      primaryNode: availablePrimaryNodes[MAINNET].chronobank,
    },
    {
      chronobankMiddlewares: availableChronoBankMiddlewares[MAINNET],
      networkId: 1,
      networkIndex: 1,
      networkTitle: 'Infura - Mainnet (production)',
      networkType: MAINNET,
      primaryNode: availablePrimaryNodes[MAINNET].infura,
    },
    {
      chronobankMiddlewares: availableChronoBankMiddlewares[TESTNET],
      networkId: 4,
      networkIndex: 2,
      networkTitle: 'ChronoBank - Rinkeby (testnet)',
      networkType: TESTNET,
      primaryNode: availablePrimaryNodes[TESTNET].chronobank,
    },
    {
      chronobankMiddlewares: availableChronoBankMiddlewares[TESTNET],
      networkId: 4,
      networkIndex: 3,
      networkTitle: 'Infura - Rinkeby (testnet)',
      networkType: TESTNET,
      primaryNode: availablePrimaryNodes[TESTNET].infura,
    },
  ],
  selected: null,
}
