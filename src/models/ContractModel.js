import {Record as record} from 'immutable';
import * as validation from '../components/forms/validate';

//noinspection JSUnusedLocalSymbols
export const abstractContractModel = defaultValues => class ContractModel extends record({
    address: null,
    name: null,
    ...defaultValues
}) {
    name() {
        return this.get('name');
    };

    address() {
        return this.get('address');
    };
};

export const validate = values => {
    const errors = {};
    errors.address = validation.address(values.get('address'));
    errors.name = validation.name(values.get('name'));
    return errors;
};

export default abstractContractModel();