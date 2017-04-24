
// TODO @dkchv: should we use truffle-config directrly?
export const networkMap = {
  local: {
    id: 1493029075432,
    protocol: 'http',
    host: 'localhost',
    port: 8545,
    name: 'Local'
  },
  ropsten: {
    id: 3,
    protocol: 'https',
    host: 'localhost',
    port: 8545,
    name: 'Ropsten'
  },
  morden: {
    id: 2,
    protocol: 'https',
    host: 'localhost',
    port: 8545,
    name: 'Morden'
  }
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
    id: 1493029075432,
    name: 'TestRPC'
  }
}
