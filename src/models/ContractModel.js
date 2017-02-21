import {Record as record} from 'immutable';

//noinspection JSUnusedLocalSymbols
const abstractContractModel = defaultValues => class ContractModel extends record({
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

export {
    abstractContractModel
}

export default abstractContractModel();