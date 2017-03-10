import * as validation from '../../components/forms/validate';
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

export const validate = values => {
    const errors = {};
    errors.address = validation.address(values.get('address'));
    return errors;
};

export default abstractOtherContractModel();