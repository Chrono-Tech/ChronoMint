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
  id: 42,
  name: 'Kovan (test network)'
}]

export const infuraNetworkMap = [{
  id: 1,
  protocol: 'https',
  host: 'mainnet.infura.io/PVe9zSjxTKIP3eAuAHFA',
  name: 'Mainnet (production)'
}, {
  id: 2,
  protocol: 'https',
  host: 'ropsten.infura.io/PVe9zSjxTKIP3eAuAHFA',
  name: 'Ropsten (test network)'
}, {
  id: 3,
  protocol: 'https',
  host: 'consensysnet.infura.io/PVe9zSjxTKIP3eAuAHFA',
  name: 'ConsenSys (test network)'
}, {
  id: 4,
  protocol: 'https',
  host: 'kovan.infura.io/PVe9zSjxTKIP3eAuAHFA',
  name: 'Kovan (test network)'
}]

export const infuraLocalNetwork = {
  id: LOCAL_ID,
  protocol: 'http',
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

export const getNetworksByProvider = (providerId) => {
  switch (providerId) {
    case providerMap.metamask.id:
      return metamaskNetworkMap
    case providerMap.infura.id:
      return infuraNetworkMap
    default:
      return []
  }
}

export const getNetworkById = (networkId, providerId) => {
  const networkMap = getNetworksByProvider(providerId)
  return networkMap.find((net) => net.id === networkId) || {}
}
