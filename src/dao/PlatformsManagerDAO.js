import AbstractContractDAO from './AbstractContractDAO'
import web3Converter from 'utils/Web3Converter'
import {getPlatforms} from 'redux/assetsManager/actions'
import contractManager from 'dao/ContractsManagerDAO'

export const TX_CREATE_PLATFORM = 'createPlatform'
export const TX_ATTACH_PLATFORM = 'attachPlatform'
export const TX_DETACH_PLATFORM = 'detachPlatform'

export default class PlatformsManagerDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/PlatformsManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  getPlatformsCount (account) {
    return this._callNum('getPlatformsForUserCount', [account])
  }

  async createPlatform (name) {
    const tx = await this._tx(TX_CREATE_PLATFORM, [name])
    return tx.tx
  }

  async getPlatformsMetadataForUser (account, dispatch) {
    const platformsList = await this._call('getPlatformsMetadataForUser', [account])
    let formatPlatformsList = []
    if (platformsList.length) {
      for (let i = 0; i < platformsList[0].length; i++) {
        formatPlatformsList.push({
          address: platformsList[0][i],
          name: web3Converter.bytesToString(platformsList[1][i]),
        })
        // TODO @abdulov optimize watchers
        const tokenManagementExtensionDAO = await contractManager.getTokenManagementExtensionDAO(platformsList[0][i])
        tokenManagementExtensionDAO.watchCreateAsset(account, dispatch)
      }
    }
    return formatPlatformsList
  }

  async attachPlatform (address) {
    const tx = await this._tx(TX_ATTACH_PLATFORM, [address])
    return tx.tx
  }

  async detachPlatform (address) {
    const tx = await this._tx(TX_DETACH_PLATFORM, [address])
    return tx.tx
  }

  watchCreatePlatform (account, dispatch) {
    this._watch('PlatformRequested', () => {
      dispatch(getPlatforms())
    }, {from: account})

    this._watch('PlatformAttached', () => {
      dispatch(getPlatforms())
    }, {from: account})
  }
}
