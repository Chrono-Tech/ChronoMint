import {abstractNoticeModel} from './NoticeModel';
import TokenContractModel from '../TokenContractModel';

class TokenContractNoticeModel extends abstractNoticeModel({
    token: new TokenContractModel()
}) {
    constructor(data) {
        super({
            ...data,
            token: data.token instanceof TokenContractModel ? data.token : new TokenContractModel(data.token)
        });
    }

    message() {
        return 'Token ' + this.get('token').symbol() + ' contract was updated.';
    };
}

export default TokenContractNoticeModel;