/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from './BitcoinProvider'

export const NETWORK_MAIN_ID = 1
export const CUSTOM_PROVIDER_ID = 'CustomProviderID'
export const LOCAL_ID = 9999999999
export const LOCAL_PROVIDER_ID = 8
// export const LOCAL_MNEMONIC = 'video visa alcohol fault earth naive army senior major inherit convince electric'
export const LOCAL_PRIVATE_KEYS = [
  '6b9027372deb53f4ae973a5614d8a57024adf33126ece6b587d9e08ba901c0d2',
  '993130d3dd4de71254a94a47fdacb1c9f90dd33be8ad06b687bd95f073514a97',
  'c3ea2286b88b51e7cd1cf09ce88b65e9c344302778f96a145c9a01d203f80a4c',
  '51cd20e24463a0e86c540f074a5f083c334659353eec43bb0bd9297b5929bd35',
  '7af5f0d70d97f282dfd20a9b611a2e4bd40572c038a89c0ee171a3c93bd6a17a',
  'cfc6d3fa2b579e3023ff0085b09d7a1cf13f6b6c995199454b739d24f2cf23a5',
]

export const INFURA_TOKEN = 'PVe9zSjxTKIP3eAuAHFA'
export const UPORT_ID = '0xfbbf28aaba3b2fc6dfe1a02b9833ccc90b8c4d26'

export const TESTRPC_URL = '/web3/'

// ---------- network's base parameters

const blockExplorersMap = {
  Ethereum: {
    mainnet: [
      'https://etherscan.io/tx',
      'https://api.etherscan.io',
    ],
    testnet: [
      'https://rinkeby.etherscan.io/tx',
      'https://rinkeby.etherscan.io',
    ],
  },
  [BLOCKCHAIN_BITCOIN]: {
    mainnet: 'https://blockexplorer.com/tx',
    testnet: 'https://live.blockcypher.com/btc-testnet/tx',
  },
  [BLOCKCHAIN_BITCOIN_CASH]: {
    mainnet: 'https://bcc.blockdozer.com/insight/tx',
    testnet: 'https://tbcc.blockdozer.com/insight/tx',
  },
  [BLOCKCHAIN_BITCOIN_GOLD]: {
    mainnet: 'https://btgexplorer.com/tx',
    testnet: null,
  },
  [BLOCKCHAIN_LITECOIN]: {
    mainnet: 'https://live.blockcypher.com/ltc/tx',
    testnet: 'https://chain.so/tx/LTCTEST',
  },
}

const MAINNET_BASE = {
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  name: 'Mainnet (production)',
  scanner: blockExplorersMap.Ethereum.mainnet,
  bitcoin: 'bitcoin',
  bitcoinCash: 'bitcoin',
  bitcoinGold: 'bitcoingold',
  litecoin: 'litecoin',
  nem: 'mainnet',
  waves: 'MAINNET_CONFIG',
}

const RINKEBY_BASE = {
  id: 4,
  protocol: 'https',
  name: 'Rinkeby (test network)',
  scanner: blockExplorersMap.Ethereum.testnet,
  bitcoin: 'testnet',
  bitcoinCash: 'testnet',
  bitcoinGold: 'bitcoingold_testnet',
  litecoin: 'litecoin_testnet',
  nem: 'testnet',
  waves: 'TESTNET_CONFIG',
}

const LOCALHOST_BASE = {
  id: LOCAL_ID,
  protocol: process.env.BASE_SCHEMA || 'https',
  name: 'Localhost',
}

// descriptions only, without hosts
const BASE_NETWORK_MAP = [
  LOCALHOST_BASE,
  MAINNET_BASE,
  RINKEBY_BASE,
]

// --------- middleware

export const MIDDLEWARE_MAP = {
  eth: {
    local: '/_exchange/',
    mainnet: 'https://middleware-ethereum-mainnet-rest.chronobank.io/',
    testnet: 'https://middleware-ethereum-testnet-rest.chronobank.io/',
  },
}

// --------- providers

export const infuraMainnet =   {
  ...MAINNET_BASE,
  host: `mainnet.infura.io/${INFURA_TOKEN}`,
  ws: 'wss://mainnet.infura.io/ws',
}

export const infuraTestnet =   {
  ...RINKEBY_BASE,
  host: `rinkeby.infura.io/${INFURA_TOKEN}`,
  ws: 'wss://rinkeby.infura.io/ws',
}

export const infuraNetworkMap = [
  infuraMainnet,
  infuraTestnet,
]

const mewMainnet = {
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  name: 'Mainnet (production MyEtherWallet)',
  scanner: blockExplorersMap.Ethereum.mainnet,
  bitcoin: 'bitcoin',
  bitcoinCash: 'bitcoin',
  bitcoinGold: 'bitcoingold',
  litecoin: 'litecoin',
  nem: 'mainnet',
  host: `api.myetherapi.com/eth`,
}

export const mewNetworkMap = [
  mewMainnet,
]

const givethMainnet =   {
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  name: 'Mainnet (production Giveth)',
  scanner: blockExplorersMap.Ethereum.mainnet,
  bitcoin: 'bitcoin',
  bitcoinCash: 'bitcoin',
  bitcoinGold: 'bitcoingold',
  litecoin: 'litecoin',
  nem: 'mainnet',
  waves: 'MAINNET_CONFIG',
  host: `mew.giveth.io`,
}

export const givethNetworkMap = [
  givethMainnet,
]

export const chronoBankMainnet =   {
  ...MAINNET_BASE,
  host: 'mainnet-full-parity-rpc.chronobank.io/',
}

export const chronoBankTestnet =   {
  ...RINKEBY_BASE,
  host: 'rinkeby-full-geth-rpc.chronobank.io/',
}

export const chronoBankMap = [
  chronoBankMainnet,
  chronoBankTestnet,
]


export const chronoBankPrivate = {
  id: 777,
  protocol: 'https',
  host: 'private.chronobank.io/',
  name: 'Private (develop network)',
  bitcoin: 'testnet',
  bitcoinCash: 'testnet',
  // bitcoinGold: 'bitcoingold_testnet',
  litecoin: 'litecoin_testnet',
  nem: 'testnet',
  waves: 'TESTNET_CONFIG',
}

// dev only
if (process.env['NODE_ENV'] === 'development') {
  chronoBankMap.push(chronoBankPrivate)
}

// local only
export const infuraLocalNetwork = {
  ...LOCALHOST_BASE,
  host: `localhost:3000${TESTRPC_URL}`,
  bitcoin: 'testnet',
  bitcoinCash: 'testnet',
  // bitcoinGold: 'bitcoingold_testnet',
  litecoin: 'litecoin_testnet',
  nem: 'testnet',
  waves: 'TESTNET_CONFIG',
}

export const providerMap = {
  metamask: {
    id: 1,
    name: 'Metamask/Mist',
    disabled: true,
  },
  infura: {
    id: 2,
    name: 'Infura',
    disabled: false,
  },
  chronoBank: {
    id: 4,
    name: 'ChronoBank',
    disabled: false,
  },
  mew: {
    id: 6,
    name: 'MyEtherWallet',
    disabled: false,
  },
  giveth: {
    id: 7,
    name: 'Giveth',
    disabled: false,
  },
  uport: {
    id: 5,
    name: 'UPort',
    disabled: false,
  },
  local: {
    id: LOCAL_PROVIDER_ID,
    name: 'TestRPC',
    disabled: true,
  },
}

export const createNetworkProvider = (name, disabled = false) => {
  return {
    id: uuid(),
    name,
    disabled,
  }
}

export const getNetworksByProvider = (providerId, withLocal = false) => {
  switch (providerId) {
    case providerMap.uport.id:
    case providerMap.metamask.id: {
      return [...BASE_NETWORK_MAP]
    }
    case providerMap.infura.id: {
      const networks = [...infuraNetworkMap]
      if (withLocal) {
        networks.push(infuraLocalNetwork)
      }
      return networks
    }
    case providerMap.giveth.id: {
      const networks = [...givethNetworkMap]
      if (withLocal) {
        networks.push(infuraLocalNetwork)
      }
      return networks
    }
    case providerMap.mew.id: {
      const networks = [...mewNetworkMap]
      if (withLocal) {
        networks.push(infuraLocalNetwork)
      }
      return networks
    }
    case providerMap.chronoBank.id: {
      return [...chronoBankMap]
    }
    case providerMap.local.id: {
      return [infuraLocalNetwork]
    }
    default: {
      return []
    }
  }
}

export const getNetworksWithProviders = (providers = [], withLocal = false) => {
  let networks = []

  providers
    .filter((provider) => provider && !provider.disabled)
    .forEach((provider) => {

      const networksProvider = getNetworksByProvider(provider && provider.id, withLocal)
        .map((network) => ({
          provider,
          network,
        }))

      networks = networks.concat(networksProvider)
    })

  if (withLocal) {
    networks.push({
      provider: providerMap.local,
      network: infuraLocalNetwork,
    })
  }

  return networks
}

export const getNetworkWithProviderNames = (providerId, networkId, withLocal = false) => {
  if (isLocalNode(providerId, networkId)){
    return 'localNode'
  }

  const provider = getProviderById(providerId)
  const network = getNetworkById(networkId, providerId, withLocal)

  if (!provider.name && !network.name){
    return ''
  }

  return `${provider.name} - ${network.name}`
}

export const isLocalNode = (providerId, networkId) => {
  return providerId === LOCAL_PROVIDER_ID && networkId === LOCAL_ID
}

export const getProviderById = (providerId) => {
  return providerMap[Object.keys(providerMap).find((key) => providerMap[key].id === providerId)] || {}
}

export const getNetworkById = (networkId, providerId, withLocal = false) => {
  const networkMap = getNetworksByProvider(providerId, withLocal)
  return networkMap.find((net) => net.id === networkId) || {}
}

export const getScannerById = (networkId, providerId, api = false) => {
  let scanner = getNetworkById(networkId, providerId).scanner
  if (Array.isArray(scanner)) {
    scanner = scanner[api ? 1 : 0]
  }
  return scanner
}

export const getBlockExplorerUrl = (networkId, providerId, txHash, blockchain) => {
  try {
    const isTestnet = isTestingNetwork(networkId, providerId)
    const explorers = blockExplorersMap[blockchain]
    if (!explorers) {
      // TODO @ipavlenko: We have no TX history & TX explorers for some blockchains, for NEM for example
      // Public installations have no https support.
      return null
    }
    let baseUrl = explorers[isTestnet ? 'testnet' : 'mainnet']
    if (Array.isArray(baseUrl)) {
      baseUrl = baseUrl[0]
    }

    return baseUrl ? (`${baseUrl}/${txHash}`) : null
  } catch (e) {
    // eslint-disable-next-line
    console.error('getBlockExplorerUrl', e.message)
  }
}

export const isTestingNetwork = (networkId, providerId) => {
  const net = getNetworkById(networkId, providerId)
  return net.id !== NETWORK_MAIN_ID
}

export const networkSelectorGroups = [
  {
    title: 'Production networks',
    description: 'Manage your funds',
    providers: [
      {
        provider: providerMap.chronoBank,
        network: chronoBankMainnet,
      },
      {
        provider: providerMap.infura,
        network: infuraMainnet,
      },
      {
        provider: providerMap.mew,
        network: mewMainnet,
      },
      {
        provider: providerMap.giveth,
        network: givethMainnet,
      },
    ],
  },
  {
    title: 'Test networks',
    description: 'Test networks with fake funds',
    providers: [
      {
        provider: providerMap.chronoBank,
        network: chronoBankTestnet,
      },
      {
        provider: providerMap.infura,
        network: infuraTestnet,
      },
    ],
  },
  {
    title: 'Developer networks',
    providers: [
      {
        provider: providerMap.local,
        network: infuraLocalNetwork,
      },
      process.env['NODE_ENV'] === 'development' ? {
        provider: providerMap.chronoBank,
        network: chronoBankPrivate,
      } : null,
    ],
  },
]
