import AbstractContractDAO from './AbstractContractDAO'
import {getTokens} from 'redux/assetsManager/actions'

export default class TokenManagementExtensionDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/TokenManagementExtension.json'), at)
  }

  createAssetWithFee (symbol, name, description, value, decimals, isMint, feeAddress, feePercent, tokenImg) {
    return this._tx('createAssetWithFee', [symbol, name, description, value, decimals, isMint, feeAddress, feePercent, tokenImg])
  }

  createAssetWithoutFee (symbol, name, description, value, decimals, isMint, tokenImg) {
    return this._tx('createAssetWithoutFee', [symbol, name, description, value, decimals, isMint, tokenImg])

  }

  watchCreateAsset (account, dispatch) {
    this._watch('AssetCreated', () => {
      dispatch(getTokens)
    }, {from: account})
  }
}
