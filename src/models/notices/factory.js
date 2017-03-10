import NoticeModel from './NoticeModel';
import CBENoticeModel from './CBENoticeModel';
import TokenContractNoticeModel from './TokenContractNoticeModel';
import LOCNoticeModel from './LOCNoticeModel';
import PendingOperationNoticeModel from './PendingOperationNoticeModel';
import OtherContractNoticeModel from './OtherContractNoticeModel';

// Important! To enable your notice model add it to the list below
const classes = {
    NoticeModel,
    CBENoticeModel,
    TokenContractNoticeModel,
    OtherContractNoticeModel,
    LOCNoticeModel,
    PendingOperationNoticeModel
};

export default (name, data) => new classes[name](data);