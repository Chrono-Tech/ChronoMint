// import contractManager from 'dao/ContractsManagerDAO'
import AbstractContractDAO from './AbstractContractDAO'
import web3Converter from 'utils/Web3Converter'

export default class AssetsManagerDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/AssetsManager.json'), at)
  }

  getTokenExtension (platform) {
    return this._call('getTokenExtension', [platform])
  }

  async getAssetsForOwner (owner) {
    const tokensList = await this._call('getAssetsForOwner', [owner])
    // const ERC20Manager = await contractManager.getERC20ManagerDAO()
    // const tokens = await   ERC20Manager.getTokens(tokensList.map(token => web3Converter.bytesToString(token)))
    return tokensList.map(token => web3Converter.bytesToString(token))
  }

  async getManagers (owner) {
    const managersList = await this._call('getManagers', [owner])
    let formatManagersList = {}
    managersList.map(manager => {
      if (manager !== '0x0000000000000000000000000000000000000000' && !formatManagersList[manager]) {
        formatManagersList[manager] = manager
      }
    })

    return Object.keys(formatManagersList)
  }
}
