import {abstractOtherContractModel} from './AbstractOtherContractModel';

class ExchangeContractModel extends abstractOtherContractModel() {
    name() {
        return 'Exchange';
    }
}

export default ExchangeContractModel;