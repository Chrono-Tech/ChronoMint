import NoticeModel from './NoticeModel';
import CBENoticeModel from './CBENoticeModel';
import TokenContractNoticeModel from './TokenContractNoticeModel';

// Important! To enable your notice model add it to the list below
const classes = {
    NoticeModel,
    CBENoticeModel,
    TokenContractNoticeModel
};

export default (name, data) => new classes[name](data);