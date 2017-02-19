import {Record} from 'immutable';

//noinspection JSUnusedLocalSymbols
const AbstractContractModel = defaultValues => class ContractModel extends Record({
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
    AbstractContractModel
}

export default AbstractContractModel();