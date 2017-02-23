import {abstractNoticeModel} from './NoticeModel';

const makeMessage = (data) => {
    return data.message || 'LOC "' + data.loc.get('locName') + '" was added.';
};

class LOCNoticeModel extends abstractNoticeModel() {
    constructor(data) {
        super({message: makeMessage(data)});
    }
}

export default LOCNoticeModel;