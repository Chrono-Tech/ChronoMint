import * as validation from '../../components/forms/validate';
import {abstractContractModel} from './AbstractContractModel';
import AbstractOtherContractDAO from '../../dao/AbstractOtherContractDAO';

export const abstractOtherContractModel = defaultValues => class AbstractOtherContractModel extends abstractContractModel({
    dao: null,
    settings: {},
    ...defaultValues
}) {
    constructor(address: string, dao: string) {
        if (new.target === AbstractOtherContractModel) {
            throw new TypeError('Cannot construct AbstractOtherContractModel instance directly');
        }
        super({address, dao});
    }

    /** @return {Promise.<AbstractOtherContractDAO>} */
    dao() {
        return this.get('dao');
    }

    settings() {
        return this.get('settings');
    }

    //noinspection JSUnusedLocalSymbols - because abstract
    /**
     * If contract has editable settings, then this method should be overridden and returns JSX of settings redux form.
     * Form should use provided ref and onSubmit handler.
     * @param ref
     * @param onSubmit
     * @return {null|jsx}
     */
    form(ref, onSubmit) {
        return null;
    }
};

export const validate = values => {
    const errors = {};
    errors.address = validation.address(values.get('address'));
    return errors;
};

export default abstractOtherContractModel();