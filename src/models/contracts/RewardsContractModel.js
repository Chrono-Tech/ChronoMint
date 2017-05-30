import AbstractOtherContractModel from './AbstractOtherContractModel'
import DAORegistry from '../../dao/DAORegistry'

class RewardsContractModel extends AbstractOtherContractModel {
  dao () {
    return DAORegistry.getRewardsDAO(this.address())
  }

  name () {
    return 'Rewards'
  }
}

export default RewardsContractModel
