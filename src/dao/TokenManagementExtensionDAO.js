import AbstractContractDAO from './AbstractContractDAO'

export default class TokenManagementExtensionDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(require('chronobank-smart-contracts/build/contracts/TokenManagementExtension.json'), at)
  }

  createAssetWithFee (symbol, name, description, value, decimals, isMint, feeAddress, feePercent) {
    return this._tx('createAssetWithFee', [symbol, name, description, value, decimals, isMint, feeAddress, feePercent])
  }

  createAssetWithoutFee (symbol, name, description, value, decimals, isMint) {
    return this._tx('createAssetWithoutFee', [symbol, name, description, value, decimals, isMint])

  }

}
