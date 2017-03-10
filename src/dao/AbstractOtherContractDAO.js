import AbstractContractDAO from './AbstractContractDAO';

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
}

export default AbstractOtherContractDAO;