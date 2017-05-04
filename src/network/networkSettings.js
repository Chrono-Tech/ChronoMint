export const LOCAL_ID = 9999999999

const scannerMap = {
  main: 'https://etherscan.io',
  ropsten: 'https://ropsten.etherscan.io',
  kovan: 'https://kovan.etherscan.io'
}

export const metamaskNetworkMap = [{
  id: LOCAL_ID,
  name: 'Localhost',
  scanner: scannerMap.local
}, {
  id: 1,
  name: 'Main Ethereum Network',
  scanner: scannerMap.main
}, {
  id: 2,
  name: 'Morden'
}, {
  id: 3,
  name: 'Ropsten (test network)',
  scanner: scannerMap.ropsten
}, {
  id: 4,
  name: 'Pinkeby (test network)'
}, {
  id: 42,
  name: 'Kovan (test network)',
  scanner: scannerMap.kovan
}]

const infraToken = 'PVe9zSjxTKIP3eAuAHFA'

export const infuraNetworkMap = [{
  id: 1,
  protocol: 'https',
  host: `mainnet.infura.io/${infraToken}`,
  name: 'Mainnet (production)',
  scanner: scannerMap.main
}, {
  id: 3,
  protocol: 'https',
  host: `ropsten.infura.io/${infraToken}`,
  name: 'Ropsten (test network)',
  scanner: scannerMap.ropsten
}, {
  id: 4,
  protocol: 'https',
  host: `consensysnet.infura.io/${infraToken}`,
  name: 'ConsenSys (test network)'
}, {
  id: 42,
  protocol: 'https',
  host: `kovan.infura.io/${infraToken}`,
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
    disabled: true
  },
  infura: {
    id: 2,
    name: 'Infura',
    disabled: false
  },
  local: {
    id: LOCAL_ID,
    name: 'Local',
    disabled: true
  }
}

export const getNetworksByProvider = (providerId, withLocal = false) => {
  switch (providerId) {
    case providerMap.metamask.id:
      return [...metamaskNetworkMap]
    case providerMap.infura.id:
      const networks = [...infuraNetworkMap]
      if (withLocal) {
        networks.push(infuraLocalNetwork)
      }
      return networks
    default:
      return []
  }
}

export const getNetworkById = (networkId, providerId, withLocal = false) => {
  const networkMap = getNetworksByProvider(providerId, withLocal)
  return networkMap.find((net) => net.id === networkId) || {}
}

export const getScannerById = (networkId, providerId) => {
  return getNetworkById(networkId, providerId).scanner
}
