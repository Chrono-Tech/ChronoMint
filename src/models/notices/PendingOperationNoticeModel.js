import {abstractNoticeModel} from './NoticeModel';

const makeMessage = (data) => {
    return data.message || 'Pending operation ' + data.pending.get('operation') + ' '
        + (data.revoke ? 'was revoked.' : 'was confirmed.');
};

class PendingOperationNoticeModel extends abstractNoticeModel() {
    constructor(data) {
        super({message: makeMessage(data)});
    }
}

export default PendingOperationNoticeModel;