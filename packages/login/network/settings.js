export const NETWORK_MAIN_ID = 1
export const LOCAL_ID = 9999999999
export const LOCAL_PROVIDER_ID = 6

export const INFURA_TOKEN = 'PVe9zSjxTKIP3eAuAHFA'
export const UPORT_ID = '0xfbbf28aaba3b2fc6dfe1a02b9833ccc90b8c4d26'

export const TESTRPC_URL = '/web3/'

const scannerMap = {
  // only for mainnet API url is different from web-interface url
  main: [
    'https://etherscan.io',
    'https://api.etherscan.io',
  ],
  kovan: 'https://kovan.etherscan.io',
  rinkeby: 'https://rinkeby.etherscan.io',
}

// ---------- network's base parameters

const MAINNET_BASE = {
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  name: 'Mainnet (production)',
  scanner: scannerMap.main,
  bitcoin: 'bitcoin',
  bitcoinCash: 'bitcoin',
  bitcoinGold: 'bitcoingold',
  litecoin: 'litecoin',
  nem: 'Mainnet',
}

const RINKEBY_BASE = {
  id: 4,
  protocol: 'https',
  name: 'Rinkeby (test network)',
  scanner: scannerMap.rinkeby,
  bitcoin: 'testnet',
  bitcoinCash: 'testnet',
  // bitcoinGold: 'bitcoingold_testnet',
  litecoin: 'litecoin_testnet',
  nem: 'Testnet',
}

const KOVAN_BASE = {
  id: 42,
  protocol: 'https',
  name: 'Kovan (test network)',
  scanner: scannerMap.kovan,
  bitcoin: 'testnet',
  bitcoinCash: 'testnet',
  // bitcoinGold: 'bitcoingold_testnet',
  litecoin: 'litecoin_testnet',
  nem: 'Testnet',
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
  KOVAN_BASE,
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

export const infuraNetworkMap = [ {
  ...MAINNET_BASE,
  host: `mainnet.infura.io/${INFURA_TOKEN}`,
}, {
  ...RINKEBY_BASE,
  host: `rinkeby.infura.io/${INFURA_TOKEN}`,
}, {
  ...KOVAN_BASE,
  host: `kovan.infura.io/${INFURA_TOKEN}`,
} ]

const chronoBankMap = [ {
  ...MAINNET_BASE,
  host: 'mainnet-full-parity-rpc.chronobank.io/',
}, {
  ...RINKEBY_BASE,
  host: 'rinkeby-full-geth-rpc.chronobank.io/',
}, {
  ...KOVAN_BASE,
  host: 'kovan-fast-parity-rpc.chronobank.io/',
} ]

// dev only
if (process.env.NODE_ENV === 'development') {
  chronoBankMap.push({
    id: 777,
    protocol: 'https',
    host: 'private.chronobank.io/',
    name: 'Private (develop network)',
    bitcoin: 'testnet',
    bitcoinCash: 'testnet',
    // bitcoinGold: 'bitcoingold_testnet',
    litecoin: 'litecoin_testnet',
    nem: 'Testnet',
  })
}

// local only
export const infuraLocalNetwork = {
  ...LOCALHOST_BASE,
  host: `localhost:3000${TESTRPC_URL}`,
  bitcoin: 'testnet',
  bitcoinCash: 'testnet',
  // bitcoinGold: 'bitcoingold_testnet',
  litecoin: 'litecoin_testnet',
  nem: 'Testnet',
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
  uport: {
    id: 5,
    name: 'UPort',
    disabled: false,
  },
  local: {
    id: LOCAL_PROVIDER_ID,
    name: 'Local',
    disabled: true,
  },
}

export const getNetworksByProvider = (providerId, withLocal = false) => {
  switch (providerId) {
    case providerMap.uport.id:
    case providerMap.metamask.id: {
      return [ ...BASE_NETWORK_MAP ]
    }
    case providerMap.infura.id: {
      const networks = [ ...infuraNetworkMap ]
      if (withLocal) {
        networks.push(infuraLocalNetwork)
      }
      return networks
    }
    case providerMap.chronoBank.id: {
      return [ ...chronoBankMap ]
    }
    case providerMap.local.id: {
      return [ infuraLocalNetwork ]
    }
    default: {
      return []
    }
  }
}

export const getProviderById = (providerId) => {
  return providerMap[Object.keys(providerMap).find((key) => providerMap[ key ].id === providerId)] || {}
}

export const getNetworkById = (networkId, providerId, withLocal = false) => {
  const networkMap = getNetworksByProvider(providerId, withLocal)
  return networkMap.find((net) => net.id === networkId) || {}
}

export const getScannerById = (networkId, providerId, api = false) => {
  let scanner = getNetworkById(networkId, providerId).scanner
  if (Array.isArray(scanner)) {
    scanner = scanner[ api ? 1 : 0 ]
  }
  return scanner
}

export const getEtherscanUrl = (networkId, providerId, txHash) => {
  const baseScannerUrl = getScannerById(networkId, providerId)
  return baseScannerUrl ? (`${baseScannerUrl}/tx/${txHash}`) : null
}

export const isTestingNetwork = (networkId, providerId) => {
  const net = getNetworkById(networkId, providerId)
  return net.id !== NETWORK_MAIN_ID
}
