import type BigNumber from 'bignumber.js'
import ChronoBankAssetWithFeeProxyABI from 'chronobank-smart-contracts/build/contracts/ChronoBankAssetWithFeeProxy.json'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ERC20DAO from './ERC20DAO'

/**
 * Labour Hour Test token
 * Only for intermediate development
 */
class LHTDAO extends ERC20DAO {
  constructor () {
    super(null, ChronoBankAssetWithFeeProxyABI)

    this.initMetaData()
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

export default new LHTDAO()
