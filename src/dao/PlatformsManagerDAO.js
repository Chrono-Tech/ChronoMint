import { getPlatforms, getPlatformsCount, setTx, SET_WATCHERS } from 'redux/assetsManager/actions'
import web3Converter from 'utils/Web3Converter'
import contractManager from 'dao/ContractsManagerDAO'
import AbstractContractDAO from './AbstractContractDAO'

export const TX_CREATE_PLATFORM = 'createPlatform'
export const TX_ATTACH_PLATFORM = 'attachPlatform'
export const TX_DETACH_PLATFORM = 'detachPlatform'
export const TX_REISSUE_ASSET = 'reissueAsset'

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
      for (let i = 0; i < platformsList[0].length; i++) {
        formatPlatformsList.push({
          address: platformsList[0][i],
          name: web3Converter.bytesToString(platformsList[1][i]),
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
    this._watch('PlatformRequested', tx => {
      dispatch(setTx(tx))
      dispatch(getPlatformsCount())
      dispatch(getPlatforms())
    }, {from: account})

    this._watch('PlatformAttached', tx => {
      dispatch(setTx(tx))
      dispatch(getPlatformsCount())
      dispatch(getPlatforms())
    }, {from: account})
  }

  async watchAssets (platformList, account, dispatch, state) {
    const watchers = {...state['watchers']}
    for (let platform of platformList) {
      if (!watchers[platform.address]) {
        const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(platform.address)
        chronoBankPlatformDAO.watchAssets(account, dispatch)

        watchers[platform.address] = true
      }
    }
    dispatch({type: SET_WATCHERS, payload: {watchers}})
  }
}
