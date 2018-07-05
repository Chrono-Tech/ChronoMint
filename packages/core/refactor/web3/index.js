import Web3 from 'web3'
import { ethDAO } from 'packages/core/refactor/daos/index'

// TODO @ipavlenko: Move to config file
const config = {
  blockchain: {
    websocket: 'wss://parity.tp.ntr1x.com:8546',
  },
}

export default () => {
  const web3Provider =
    // Web3.givenProvider ||
    new Web3.providers.WebsocketProvider(config.blockchain.websocket)
    // || new Web3.providers.HttpProvider(config.blockchain.rpc)
  const web3 = new Web3(web3Provider)
  ethDAO.connect(web3)
  return web3
}
