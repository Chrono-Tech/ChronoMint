import {abstractNoticeModel} from './AbstractNoticeModel';
import DAOFactory from '../../dao/DAOFactory';

class OtherContractNoticeModel extends abstractNoticeModel({
    contract: null,
    isRevoked: false,
    type: null
}) {
    constructor(data) {
        const types = DAOFactory.getOtherDAOsTypes();
        const isNew = data.contract.__proto__.constructor.name !== 'Object'
                      && data.contract.__proto__.__proto__.constructor.name === 'AbstractOtherContractModel';
        if (isNew) {
            // define type by contract model instance
            for (let key in types) {
                if (types.hasOwnProperty(key)) {
                    if (data.contract instanceof DAOFactory.getDAOs()[types[key]].getContractModel()) {
                        data.type = types[key];
                    }
                }
            }
        }
        if (!data.hasOwnProperty('type') || !types.includes(data.type)) {
            throw new TypeError('invalid type');
        }
        const Model = DAOFactory.getDAOs()[data.type].getContractModel();
        super({
            ...data,
            contract: isNew ? data.contract : new Model(data.contract.address, data.contract.dao)
        });
    }

    /** @return {AbstractOtherContractModel} */
    contract() {
        return this.get('contract');
    }

    isRevoked() {
        return this.get('isRevoked');
    }

    message() {
        return this.contract().name() + ' contract was ' + (this.isRevoked() ? 'revoked' : 'added') + '.';
    };
}

export default OtherContractNoticeModel;