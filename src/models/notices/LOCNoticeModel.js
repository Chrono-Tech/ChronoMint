import {abstractNoticeModel} from './NoticeModel';
import LOCModel from '../LOCModel';

class LOCNoticeModel extends abstractNoticeModel({
    locModel: null,
}) {
    constructor(data) {
        super(data);
    }

    message() {
        return 'LOC "' + this.get('locModel').get('locName') + '" was added.';
    };
}

export default LOCNoticeModel;