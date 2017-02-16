import NoticeModel from './NoticeModel';

class CBENoticeModel extends NoticeModel {
    constructor(message: string) {
        super({message});
    }
}

export default CBENoticeModel;