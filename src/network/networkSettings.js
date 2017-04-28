export const LOCAL_ID = 9999999999

export const metamaskNetworkMap = [{
  id: LOCAL_ID,
  name: 'Localhost'
}, {
  id: 1,
  name: 'Main Ethereum Network'
}, {
  id: 2,
  name: 'Morden'
}, {
  id: 3,
  name: 'Ropsten (test network)'
}, {
  id: 4,
  name: 'Pinkeby (test network)'
}, {
  id: 42,
  name: 'Kovan (test network)'
}]

const infraToken = 'PVe9zSjxTKIP3eAuAHFA'

export const infuraNetworkMap = [{
  id: 1,
  protocol: 'https',
  host: `mainnet.infura.io/${infraToken}`,
  name: 'Mainnet (production)'
}, {
  id: 2,
  protocol: 'https',
  host: `ropsten.infura.io/${infraToken}`,
  name: 'Ropsten (test network)'
}, {
  id: 3,
  protocol: 'https',
  host: `consensysnet.infura.io/${infraToken}`,
  name: 'ConsenSys (test network)'
}, {
  id: 4,
  protocol: 'https',
  host: `kovan.infura.io/${infraToken}`,
  name: 'Kovan (test network)'
}]

export const infuraLocalNetwork = {
  id: LOCAL_ID,
  protocol: 'https',
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
  uport: {
    id: 3,
    name: 'UPort',
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
