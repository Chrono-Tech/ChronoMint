import {abstractNoticeModel} from './NoticeModel';
import AbstractOtherContractModel from '../contracts/AbstractOtherContractModel';
import AppDAO from '../../dao/AppDAO';

class OtherContractNoticeModel extends abstractNoticeModel({
    contract: null,
    revoke: false,
    type: null
}) {
    constructor(data) {
        const types = AppDAO.getOtherDAOsTypes();
        if (data.contract.__proto__ instanceof AbstractOtherContractModel) {
            // define type by contract model instance
            for (let key in types) {
                if (types.hasOwnProperty(key)) {
                    if (data.contract instanceof AppDAO.getDAOs()[types[key]].getContractModel()) {
                        data.type = types[key];
                    }
                }
            }
        }
        if (!data.hasOwnProperty('type') || !types.includes(data.type)) {
            throw new TypeError('invalid type');
        }
        const Model = AppDAO.getDAOs()[data.type].getContractModel();
        super({
            ...data,
            contract: data.contract.__proto__ instanceof AbstractOtherContractModel ?
                data.contract : new Model(data.contract)
        });
    }

    message() {
        return this.get('contract').name() + ' contract was ' +
            (this.get('revoke') ? 'revoked' : 'added') + '.';
    };
}

export default OtherContractNoticeModel;