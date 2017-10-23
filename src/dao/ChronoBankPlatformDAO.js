import AbstractContractDAO from './AbstractContractDAO'
import web3Converter from 'utils/Web3Converter'
import {setTotalSupply} from 'redux/assetsManager/actions'

export const TX_CREATE_PLATFORM = 'createPlatform'
export const TX_ATTACH_PLATFORM = 'attachPlatform'
export const TX_DETACH_PLATFORM = 'detachPlatform'
export const TX_REISSUE_ASSET = 'reissueAsset'

export default class ChronoBankPlatform extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/ChronoBankPlatform.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  async reissueAsset (symbol, amount) {
    const tx = await this._tx(TX_REISSUE_ASSET, [symbol, amount])
    return tx.tx
  }

  watchAssets (account, dispatch) {
    this._watch('Issue', res => {
      dispatch(setTotalSupply(web3Converter.bytesToString(res.args.symbol), res.args.value))
    }, {from: account})
  }
}
