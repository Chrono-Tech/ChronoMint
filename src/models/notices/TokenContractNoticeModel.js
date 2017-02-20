import {AbstractNoticeModel} from './NoticeModel';
import TokenContractModel from '../TokenContractModel';

class TokenContractNoticeModel extends AbstractNoticeModel({
    token: new TokenContractModel
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