import NoticeModel from './NoticeModel';
import CBEModel from '../CBEModel';

class CBENoticeModel extends NoticeModel {
    constructor(cbe: CBEModel, revoke: boolean = false) {
        super({
            message: 'CBE ' + cbe.address() + ' ' + (revoke ? 'was revoked.' : 'was updated.')
        });
    }
}

export default CBENoticeModel;