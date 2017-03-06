import {abstractNoticeModel} from './NoticeModel';
import TokenContractModel from '../contracts/TokenContractModel';

class TokenContractNoticeModel extends abstractNoticeModel({
    token: null,
    revoke: false
}) {
    constructor(data) {
        super({
            ...data,
            token: data.token instanceof TokenContractModel ? data.token : new TokenContractModel(data.token)
        });
    }

    message() {
        return 'Token ' + this.get('token').symbol() + ' contract was ' +
            (this.get('revoke') ? 'revoked' : 'added') + '.';
    };
}

export default TokenContractNoticeModel;