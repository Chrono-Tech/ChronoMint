import NoticeModel from './NoticeModel';
import CBENoticeModel from './CBENoticeModel';

// Important! To enable your notice model add it to the list below
const classes = {
    NoticeModel,
    CBENoticeModel
};

export default (name, data) => {
    return new classes[name](data);
};