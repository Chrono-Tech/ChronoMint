import AbstractContractDAO from './AbstractContractDAO'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export default class AssetsManagerDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/AssetsManager.json'), at)
  }

  getTokenExtension (platform) {
    return this._call('getTokenExtension', [platform])
  }

  async getAssetsForOwner (owner) {
    const assets = await this._call('getAssetsForOwner', [owner, owner])

    let assetsList = {}
    let currentPlatform
    for (let i = 0; i < assets[0].length; i++) {

      if (assets[1][i] !== ZERO_ADDRESS) currentPlatform = assets[1][i]

      assetsList[assets[0][i]] = {
        address: assets[0][i],
        platform: currentPlatform,
        totalSupply: assets[2][i],
      }
    }
    return assetsList
  }

  async getManagers (owner) {
    const managersList = await this._call('getManagers', [owner])
    let formatManagersList = {}
    managersList.map(manager => {
      if (manager !== ZERO_ADDRESS && !formatManagersList[manager]) {
        formatManagersList[manager] = manager
      }
    })

    return Object.keys(formatManagersList)
  }

  async getManagersForAssetSymbol (symbol) {
    const managersListForSymbol = await this._call('getManagersForAssetSymbol', [symbol])

    let formatManagersList = {}
    managersListForSymbol.map(manager => {
      if (manager !== ZERO_ADDRESS && !formatManagersList[manager]) {
        formatManagersList[manager] = manager
      }
    })
    return Object.keys(formatManagersList)
  }
}
