import type BigNumber from 'bignumber.js'
import ERC20DAO from './ERC20DAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'

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
}

export default new LHTDAO()
