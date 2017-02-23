import {AbstractNoticeModel} from './NoticeModel';

const makeMessage = (data) => {
    return data.message || 'LOC "' + data.loc.get('locName') + '" was added.';
};

class LOCNoticeModel extends AbstractNoticeModel() {
    constructor(data) {
        super({message: makeMessage(data)});
    }
}

export default LOCNoticeModel;