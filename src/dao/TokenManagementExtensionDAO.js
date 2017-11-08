import BigNumber from 'bignumber.js'
import MultiEventsHistoryABI from 'chronobank-smart-contracts/build/contracts/MultiEventsHistory.json'
import TokenManagementInterfaceABI from 'chronobank-smart-contracts/build/contracts/TokenManagementInterface.json'
import TokenModel from 'models/TokenModel'
import AbstractContractDAO from './AbstractContractDAO'

export default class TokenManagementExtensionDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(TokenManagementInterfaceABI, at, MultiEventsHistoryABI)
  }

  createAssetWithFee (token: TokenModel) {
    return this._tx(
      'createAssetWithFee',
      [
        token.symbol(),
        token.symbol(),
        token.name(),
        TokenManagementExtensionDAO.addDecimals(token.totalSupply(), token.decimals()),
        token.decimals(),
        token.isReissuable(),
        token.feeAddress(),
        token.fee() * 100,
        token.icon() ? this._c.ipfsHashToBytes32(token.icon()) : '',
      ],
      token,
    )
  }

  createAssetWithoutFee (token: TokenModel) {
    return this._tx(
      'createAssetWithoutFee',
      [
        token.symbol(),
        token.symbol(),
        token.name(),
        TokenManagementExtensionDAO.addDecimals(token.totalSupply(), token.decimals()),
        token.decimals(),
        token.isReissuable(),
        token.icon() ? this._c.ipfsHashToBytes32(token.icon()) : '',
      ],
      token,
    )
  }

  static addDecimals (value, decimals) {
    if (decimals === null) {
      throw new Error('addDecimals: decimals is undefined')
    }
    const amount = new BigNumber(value.toString(10))
    return amount.mul(Math.pow(10, decimals))
  }

  static removeDecimals (value, decimals) {
    if (decimals === null) {
      throw new Error('addDecimals: decimals is undefined')
    }
    const amount = new BigNumber(value.toString(10))
    return amount.div(Math.pow(10, decimals))
  }
}
