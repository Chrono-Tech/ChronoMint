import Web3 from 'web3_1'
import { ethDAO } from '../daos/index'

export default (network) => {
  if (!network.ws) {
    return null
  }
  const web3Provider = new Web3.providers.WebsocketProvider(network.ws)
  const web3 = new Web3(web3Provider)
  ethDAO.connect(web3)
  return web3
}
