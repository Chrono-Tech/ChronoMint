import AbstractContractDAO from './AbstractContractDAO';
import AbstractOtherContractModel from '../models/contracts/AbstractOtherContractModel';

class AbstractOtherContractDAO extends AbstractContractDAO {
    constructor(json, at = null) {
        if (new.target === AbstractOtherContractDAO) {
            throw new TypeError('Cannot construct AbstractOtherContractDAO instance directly');
        }
        super(json, at);
    }

    /** @return {string} */
    static getTypeName() {
        throw new Error('should be overridden');
    }

    /** @return {object} for truffleContract */
    static getJson() {
        throw new Error('should be overridden');
    }

    /**
     * @return {class} model class, not instance! child of...
     * @see AbstractOtherContractModel
     */
    static getContractModel() {
        throw new Error('should be overridden');
    }

    /** @return {Promise.<AbstractOtherContractModel>} */
    initContractModel() {
        throw new Error('should be overridden');
    }

    retrieveSettings() {
        return new Promise(resolve => resolve({}));
    }

    //noinspection JSUnusedLocalSymbols - because abstract
    /**
     * @param model
     * @param account from
     * @return {Promise.<bool>} result
     */
    saveSettings(model: AbstractOtherContractModel, account: string) {
        return new Promise(resolve => resolve(true));
    }
}

export default AbstractOtherContractDAO;