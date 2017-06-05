import AbstractOtherContractModel from './AbstractOtherContractModel'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'

class RewardsContractModel extends AbstractOtherContractModel {
  dao () {
    return ContractsManagerDAO.getRewardsDAO(this.address())
  }

  name () {
    return 'Rewards'
  }
}

export default RewardsContractModel
