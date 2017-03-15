import {abstractNoticeModel} from './NoticeModel';
import LOCModel from '../LOCModel';

class LOCNoticeModel extends abstractNoticeModel({
    locModel: null,
}) {
    constructor(data) {
        super({
            ...data,
            locModel: data.locModel instanceof LOCModel ? data.locModel : new LOCModel(data.locModel)
        });
    }

    message() {
        return 'LOC "' + this.get('locModel').get('locName') + '" was added.';
    };
}

export default LOCNoticeModel;