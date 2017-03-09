import {abstractContractModel} from './AbstractContractModel';

export const abstractOtherContractModel = defaultValues => class AbstractOtherContractModel extends abstractContractModel({
    ...defaultValues
}) {
    constructor(data) {
        if (new.target === AbstractOtherContractModel) {
            throw new TypeError('Cannot construct AbstractOtherContractModel instance directly');
        }
        super(data);
    }
};

export default abstractOtherContractModel();