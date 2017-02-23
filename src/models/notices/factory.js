import NoticeModel from './NoticeModel';
import CBENoticeModel from './CBENoticeModel';
import TokenContractNoticeModel from './TokenContractNoticeModel';
import LOCNoticeModel from './LOCNoticeModel';
import PendingOperationNoticeModel from './PendingOperationNoticeModel';

// Important! To enable your notice model add it to the list below
const classes = {
    NoticeModel,
    CBENoticeModel,
    TokenContractNoticeModel,
    LOCNoticeModel,
    PendingOperationNoticeModel
};

export default (name, data) => {
    return new classes[name](data);
};