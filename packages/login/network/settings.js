import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from './BitcoinProvider'

export const NETWORK_MAIN_ID = 1
export const LOCAL_ID = 9999999999
export const LOCAL_PROVIDER_ID = 6
// export const LOCAL_MNEMONIC = 'video visa alcohol fault earth naive army senior major inherit convince electric'
export const LOCAL_PRIVATE_KEYS = [
  '67c4982b268a058cfea01621d11d6d785abc467719624e9f2d10d12e4f47bf85',
  '34b45a7294e70e1c018bec3b56ecdb8fb39cea7ba63128dd81c24fe90299ca92',
  'dd53d4430a945d60a399542ee512c8c0715f5d57e29d3f49fdbcf719b044c5e0',
  '3db865b60aed69742a4c8062cb54f0bcfb206e2072abadbd00520e6a5c7a416f',
  '790d8fb97c600addae9bda3949084eb516a2e5200da54f4ed4b99a680dfaa01e',
  'c88fc0b20ce13278f87490a9b924298b3560d1b3150b2f88e88797c50a048eb7',
  '531ae8d1d46c0ac0344a4df2c66d1fbff5ae162adc7e23f3cc845b8a48f7834e',
  '0a1588ce5a6f73193a2995f6d28eb3ef540af9fc560f20b9a5dd21f7a8bd435c',
  'baebd4974f876a5f93bd852e272ff78e48a834ce46a91f2f4239f38ef2cb7e04',
  '1b869f4917b523c1d26cadf6190aef45db414b3ee28dcb8a8422f933a931544a',
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
  [ BLOCKCHAIN_BITCOIN ]: {
    mainnet: 'https://blockexplorer.com/tx',
    testnet: 'https://tbtc.blockdozer.com/insight/tx',
  },
  [ BLOCKCHAIN_BITCOIN_CASH ]: {
    mainnet: 'https://bcc.blockdozer.com/insight/tx',
    testnet: 'https://tbcc.blockdozer.com/insight/tx',
  },
  [ BLOCKCHAIN_BITCOIN_GOLD ]: {
    mainnet: 'https://btgexplorer.com/tx',
    testnet: null,
  },
  [ BLOCKCHAIN_LITECOIN ]: {
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
  nem: 'Mainnet',
}

const RINKEBY_BASE = {
  id: 4,
  protocol: 'https',
  name: 'Rinkeby (test network)',
  scanner: blockExplorersMap.Ethereum.testnet,
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

export const infuraNetworkMap = [
  {
    ...MAINNET_BASE,
    host: `mainnet.infura.io/${INFURA_TOKEN}`,
  },
  {
    ...RINKEBY_BASE,
    host: `rinkeby.infura.io/${INFURA_TOKEN}`,
  },
]

const chronoBankMap = [
  {
    ...MAINNET_BASE,
    host: 'mainnet-full-parity-rpc.chronobank.io/',
  },
  {
    ...RINKEBY_BASE,
    host: 'rinkeby-full-geth-rpc.chronobank.io/',
  },
]

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
  return providerMap[ Object.keys(providerMap).find((key) => providerMap[ key ].id === providerId) ] || {}
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

export const getBlockExplorerUrl = (networkId, providerId, txHash, blockchain) => {
  try {
    const isTestnet = isTestingNetwork(networkId, providerId)
    let baseUrl = blockExplorersMap[ blockchain ][ isTestnet ? 'testnet' : 'mainnet' ]
    if (Array.isArray(baseUrl)) {
      baseUrl = baseUrl[ 0 ]
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
