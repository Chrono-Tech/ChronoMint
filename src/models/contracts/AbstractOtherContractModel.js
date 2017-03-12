import AppDAO from '../../dao/AppDAO';
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
        return AppDAO.initDAO(this.get('dao'), this.address());
    }

    settings() {
        return this.get('settings');
    }

    /** @return {Promise.<AbstractOtherContractModel>} with initialized settings */
    initSettings() {
        return new Promise(resolve => {
            this.dao().then(dao => {
                dao.retrieveSettings().then(settings => {
                    resolve(this.set('settings', settings));
                });
            });
        });
    }

    /** @return {Promise.<bool>} result */
    saveSettings(account) {
        return this.dao().then(dao => {
            return dao.saveSettings(this, account);
        });
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