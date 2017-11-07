import Amount from 'models/Amount'
import AbstractContractDAO from './AbstractContractDAO'

export default class TokenManagementExtensionDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(
      require('chronobank-smart-contracts/build/contracts/TokenManagementInterface.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  createAssetWithFee (symbol, name, description, value, decimals, isMint, feeAddress, feePercent, tokenImg) {
    const amount = new Amount(value, symbol).mul(Math.pow(10, decimals))
    return this._tx(
      'createAssetWithFee',
      [symbol, name, description, amount, decimals, isMint, feeAddress, feePercent * 100, tokenImg],
      {symbol, name, description, amount, decimals, isMint, feeAddress, feePercent, tokenImg}
    )
  }

  createAssetWithoutFee (symbol, name, description, value, decimals, isMint, tokenImg) {
    const amount = new Amount(value, symbol).mul(Math.pow(10, decimals))
    return this._tx(
      'createAssetWithoutFee',
      [symbol, name, description, amount, decimals, isMint, tokenImg],
      {symbol, name, description, value, decimals, isMint, tokenImg},
    )
  }
}
