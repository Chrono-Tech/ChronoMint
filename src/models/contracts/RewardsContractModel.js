import {abstractOtherContractModel} from './AbstractOtherContractModel';

class RewardsContractModel extends abstractOtherContractModel() {
    name() {
        return 'Rewards';
    }
}

export default RewardsContractModel;