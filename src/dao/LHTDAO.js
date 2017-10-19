import type BigNumber from 'bignumber.js'

import contractsManagerDAO from 'dao/ContractsManagerDAO'

import ERC20DAO from './ERC20DAO'

/**
 * Labour Hour Test token
 * Only for intermediate development
 */
class LHTDAO extends ERC20DAO {
  constructor () {
    super(null, require('chronobank-smart-contracts/build/contracts/ChronoBankAssetWithFeeProxy.json'))

    this.initMetaData()
  }

  async getAssetsManagerBalance (): BigNumber {
    const dao = await contractsManagerDAO.getAssetsManagerDAO()
    return this.getAccountBalance(dao.getInitAddress(), 'pending')
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

export default new LHTDAO()
