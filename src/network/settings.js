export const LOCAL_ID = 9999999999
export const INFURA_TOKEN = 'PVe9zSjxTKIP3eAuAHFA'
export const UPORT_ID = '0xfbbf28aaba3b2fc6dfe1a02b9833ccc90b8c4d26'

const scannerMap = {
  main: ['https://etherscan.io', 'https://api.etherscan.io'], // only for mainnet API url is different from web-interface url
  ropsten: 'https://ropsten.etherscan.io',
  kovan: 'https://kovan.etherscan.io',
  rinkeby: 'https://rinkeby.etherscan.io'
}

export const metamaskNetworkMap = [{
  id: LOCAL_ID,
  name: 'Localhost'
}, {
  id: 1,
  name: 'Main Ethereum Network',
  scanner: scannerMap.main
}, {
//   {
//   id: 2,
//   name: 'Morden (test network)'
// }, {
  id: 3,
  name: 'Ropsten (test network)',
  scanner: scannerMap.ropsten
}, {
//   id: 4,
//   name: 'Rinkeby (test network)',
//   scanner: scannerMap.rinkeby
// }, {
  id: 42,
  name: 'Kovan (test network)',
  scanner: scannerMap.kovan
}]

export const infuraNetworkMap = [{
  id: 1,
  protocol: 'https',
  host: `mainnet.infura.io/${INFURA_TOKEN}`,
  name: 'Mainnet (production)',
  scanner: scannerMap.main
}, {
  id: 3,
  protocol: 'https',
  host: `ropsten.infura.io/${INFURA_TOKEN}`,
  name: 'Ropsten (test network)',
  scanner: scannerMap.ropsten
}, {
//   id: 4,
//   protocol: 'https',
//   host: `rinkeby.infura.io/${INFURA_TOKEN}`,
//   name: 'Rinkeby (test network)',
//   scanner: scannerMap.rinkeby
// }, {
  id: 42,
  protocol: 'https',
  host: `kovan.infura.io/${INFURA_TOKEN}`,
  name: 'Kovan (test network)',
  scanner: scannerMap.kovan
}]

export const infuraLocalNetwork = {
  id: LOCAL_ID,
  host: 'localhost:8545',
  name: 'Local'
}

export const providerMap = {
  metamask: {
    id: 1,
    name: 'Metamask/Mist',
    disabled: true,
    isConfirmed: false
  },
  infura: {
    id: 2,
    name: 'Infura',
    disabled: false,
    isConfirmed: true
  },
  uport: {
    id: 3,
    name: 'UPort',
    disabled: false,
    isConfirmed: false
  },
  local: {
    id: LOCAL_ID,
    name: 'Local',
    disabled: true,
    isConfirmed: true
  }
}

export const getNetworksByProvider = (providerId, withLocal = false) => {
  switch (providerId) {
    case providerMap.metamask.id: {
      return [...metamaskNetworkMap]
    }
    case providerMap.infura.id: {
      const networks = [...infuraNetworkMap]
      if (withLocal) {
        networks.push(infuraLocalNetwork)
      }
      return networks
    }
    default: {
      return []
    }
  }
}

const getProviderById  = (id) => {
  const [providerKey] = Object.keys(providerMap).filter((key) => providerMap[key].id === id)
  return providerKey ? providerMap[providerKey] : null
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

export const getEtherscanUrl = (networkId, providerId, txHash) => {
  const baseScannerUrl = getScannerById(networkId, providerId)
  return baseScannerUrl ? (`${baseScannerUrl}/tx/` + txHash) : null
}

export const isConfirm = (providerId) => {
  const provider = getProviderById(providerId) || {}
  return !!provider.isConfirmed
}