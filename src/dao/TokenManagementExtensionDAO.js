import AbstractContractDAO from './AbstractContractDAO'

export default class TokenManagementExtensionDAO extends AbstractContractDAO {

  constructor (at = null) {
    // eslint-disable-next-line
    console.log('--TokenManagementExtensionDAO#constructor', at)
    super(require('chronobank-smart-contracts/build/contracts/TokenManagementExtension.json'), at)
  }

  createAsset (symbol, name, description, value, decimals, isMint, withFee) {
    return this._tx('createAsset', [symbol, name, description, value, decimals, isMint, withFee])
  }

}
