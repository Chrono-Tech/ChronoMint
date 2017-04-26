export const LOCAL_ID = 9999999999

export const metamaskNetworkMap = [{
  id: LOCAL_ID,
  protocol: 'http',
  host: 'localhost',
  port: 8545,
  name: 'Localhost'
}, {
  id: 2,
  protocol: 'https',
  host: 'localhost',
  port: 8545,
  name: 'Morden'
}, {
  id: 3,
  protocol: 'https',
  host: 'localhost',
  port: 8545,
  name: 'Ropsten'
}]

export const infuraNetworkMap = [{
  id: 1,
  protocol: 'https',
  host: 'mainnet.infura.io',
  name: 'Mainnet (production)'
}, {
  id: 2,
  protocol: 'https',
  host: 'ropsten.infura.io',
  name: 'Ropsten (test network)'
}, {
  id: 3,
  protocol: 'https',
  host: 'consensysnet.infura.io',
  name: 'ConsenSys (test network)'
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
    name: 'Metamask/Mist'
  },
  infura: {
    id: 2,
    name: 'Infura'
  },
  local: {
    id: LOCAL_ID,
    name: 'TestRPC'
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
