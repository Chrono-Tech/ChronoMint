import {abstractNoticeModel} from './NoticeModel';
import CBEModel from '../CBEModel';

class CBENoticeModel extends abstractNoticeModel({
    cbe: null,
    revoke: false
}) {
    constructor(data) {
        super({
            ...data,
            cbe: data.cbe instanceof CBEModel ? data.cbe : new CBEModel(data.cbe)
        });
    }

    message() {
        return 'CBE ' + this.get('cbe').address() + ' was ' + (this.get('revoke') ? 'revoked' : 'added') + '.';
    };
}

export default CBENoticeModel;