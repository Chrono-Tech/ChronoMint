/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type BigNumber from 'bignumber.js'
import TokenModel from '../models/tokens/TokenModel'
import contractsManagerDAO from './ContractsManagerDAO'
import ERC20DAO from './ERC20DAO'
import { ChronoBankAssetWithFeeProxyABI } from './abi'

/**
 * Labour Hour Test token
 * Only for intermediate development
 */
class LHTDAO extends ERC20DAO {
  constructor (token: TokenModel) {
    super(token, ChronoBankAssetWithFeeProxyABI)
  }

  async getAssetsManagerBalance (): BigNumber {
    const dao = await contractsManagerDAO.getAssetsManagerDAO()
    return this.getAccountBalance(dao.getInitAddress())
  }

  subscribeOnReset () {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }
}

export default new LHTDAO(new TokenModel())
