import contractManager from 'dao/ContractsManagerDAO'

import { getPlatforms, getUsersPlatforms, setTx, SET_WATCHERS } from 'redux/assetsManager/actions'

import web3Converter from 'utils/Web3Converter'

import AbstractContractDAO from './AbstractContractDAO'

export const TX_CREATE_PLATFORM = 'createPlatform'
export const TX_ATTACH_PLATFORM = 'attachPlatform'
export const TX_DETACH_PLATFORM = 'detachPlatform'
export const TX_REISSUE_ASSET = 'reissueAsset'
export const TX_PLATFORM_REQUESTED = 'PlatformRequested'
export const TX_PLATFORM_ATTACHED = 'PlatformAttached'

export default class PlatformsManagerDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/PlatformsManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async reissueAsset (symbol, amount) {
    const tx = await this._tx(TX_REISSUE_ASSET, [symbol, amount])
    return tx.tx
  }

  async createPlatform (name) {
    const tx = await this._tx(TX_CREATE_PLATFORM, [name])
    return tx.tx
  }

  async getPlatformsMetadataForUser (account) {
    const platformsList = await this._call('getPlatformsMetadataForUser', [account])
    let formatPlatformsList = []
    if (platformsList.length) {
      for (let platform of platformsList) {
        formatPlatformsList.push({
          address: platform,
          name: null,
        })
      }
    }
    return formatPlatformsList
  }

  async attachPlatform (address, name) {
    let tx
    try {
      tx = await this._tx(TX_ATTACH_PLATFORM, [address, name])
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }
    return tx.tx
  }

  async detachPlatform (address) {
    let tx
    try {
      tx = await this._tx(TX_DETACH_PLATFORM, [address])
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }
    return tx.tx
  }

  watchCreatePlatform (account, dispatch) {
    this._watch(TX_PLATFORM_REQUESTED, (tx) => {
      dispatch(setTx(tx))
      dispatch(getUsersPlatforms())
      dispatch(getPlatforms())
    }, { by: account })

    this._watch(TX_PLATFORM_ATTACHED, (tx) => {
      dispatch(setTx(tx))
      dispatch(getUsersPlatforms())
      dispatch(getPlatforms())
    }, { by: account })
  }
}
