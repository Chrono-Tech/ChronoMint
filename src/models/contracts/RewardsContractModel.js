import AbstractOtherContractModel from './AbstractOtherContractModel';
import DAOFactory from '../../dao/DAOFactory';

class RewardsContractModel extends AbstractOtherContractModel {
    dao() {
        return DAOFactory.initRewardsDAO(this.address());
    }

    name() {
        return 'Rewards';
    }
}

export default RewardsContractModel;