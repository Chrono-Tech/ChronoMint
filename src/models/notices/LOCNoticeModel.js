import {abstractNoticeModel} from './NoticeModel';
import LOCModel from '../LOCModel';

class LOCNoticeModel extends abstractNoticeModel({
    message: '',
    loc: null,
}) {
    constructor(data) {
        super({
            ...data,
            loc: data.loc instanceof LOCModel ? data.loc : new LOCModel(data.loc)
        });
    }

    message() {
        return 'LOC "' + this.get('loc').get('locName') + '" ' + this.get('message');
    };
}

export default LOCNoticeModel;