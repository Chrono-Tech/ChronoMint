import {abstractNoticeModel} from './AbstractNoticeModel';
import LOCModel from '../LOCModel';

class LOCNoticeModel extends abstractNoticeModel({
    loc: null,
}) {
    constructor(data) {
        super({
            ...data,
            loc: data.loc instanceof LOCModel ? data.loc : new LOCModel(data.loc)
        });
    }

    message() {
        return 'LOC "' + this.get('loc').get('locName') + '" was added.';
    };
}

export default LOCNoticeModel;