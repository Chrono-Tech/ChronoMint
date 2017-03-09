import AbstractContractDAO from './AbstractContractDAO';

class AbstractOtherContractDAO extends AbstractContractDAO {
    constructor(json, at = null) {
        if (new.target === AbstractOtherContractDAO) {
            throw new TypeError('Cannot construct AbstractOtherContractDAO instance directly');
        }
        super(json, at);
    }

    /** @return {object} for truffleContract */
    static getJson() {
        throw new Error('should be overridden');
    }

    /** @return {Promise.<AbstractOtherContractModel>} */
    getContractModel() {
        throw new Error('should be overridden');
    }
}

export default AbstractOtherContractDAO;