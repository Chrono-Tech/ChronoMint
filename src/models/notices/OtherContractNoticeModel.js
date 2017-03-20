import {abstractNoticeModel} from './NoticeModel';
import DAOFactory from '../../dao/DAOFactory';

class OtherContractNoticeModel extends abstractNoticeModel({
    contract: null,
    revoke: false,
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

    message() {
        return this.get('contract').name() + ' contract was ' +
            (this.get('revoke') ? 'revoked' : 'added') + '.';
    };
}

export default OtherContractNoticeModel;