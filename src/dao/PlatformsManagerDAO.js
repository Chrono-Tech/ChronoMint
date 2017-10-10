import AbstractContractDAO from './AbstractContractDAO'
import contractManager from 'dao/ContractsManagerDAO'

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

  getPlatforms (account) {
    return this._call('getPlatformForUser', [account])
  }

  async createPlatform () {
    const tx = await this._tx('createPlatform')
    return tx.tx
  }

  getPlatformForUserAtIndex (account, index) {
    return this._call('getPlatformForUserAtIndex', [account, index])
  }

  async attachPlatform (address) {
    const tx = await this._tx('attachPlatform', [address])
    return tx.tx
  }

  async detachPlatform (address) {
    const tx = await this._tx('detachPlatform', [address])
    return tx.tx
  }

  watchCreatePlatform (account) {
    this._watch('PlatformRequested', async (result) => {
      // eslint-disable-next-line
      // console.log('PlatformRequested', result)
      const ownedInterface = await contractManager.getOwnedInterfaceDAO(result.args.platform)
      // eslint-disable-next-line
      // console.log('--PlatformsManagerDAO#ownedInterface', ownedInterface)
      await ownedInterface.claimContractOwnership()
      // eslint-disable-next-line
      // console.log('--PlatformsManagerDAO#result', claimContractOwnershipResult)

    }, {from: account})

    this._watch('PlatformAttached', (result) => {
      // eslint-disable-next-line
      console.log('PlatformAttached', result)
    }, {from: account})

  }
}

