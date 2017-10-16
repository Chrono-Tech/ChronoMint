import AbstractContractDAO from './AbstractContractDAO'
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

  getPlatformsMetadataForUser (account) {
    return this._call('getPlatformsMetadataForUser', [account])
  }

  async attachPlatform (address) {
    const tx = await this._tx(TX_ATTACH_PLATFORM, [address])
    return tx.tx
  }

  async detachPlatform (address) {
    const tx = await this._tx(TX_DETACH_PLATFORM, [address])
    return tx.tx
  }

  watchCreatePlatform (account) {
    this._watch('PlatformRequested', async (result) => {
      // eslint-disable-next-line
      // console.log('PlatformRequested', result)
    }, {from: account})

    this._watch('PlatformAttached', (/*result*/) => {
      // eslint-disable-next-line
      // console.log('PlatformAttached', result)
    }, {from: account})

  }
}

