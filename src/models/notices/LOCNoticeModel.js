import {abstractNoticeModel} from './AbstractNoticeModel';
import LOCModel from '../LOCModel';

export const ADDED = 'ADDED';
export const REMOVED = 'REMOVED';
export const UPDATED = 'UPDATED';

class LOCNoticeModel extends abstractNoticeModel({
    action: null,
    loc: null,
    params: null,
}) {
    constructor(data) {
        super({
            ...data,
            loc: data.loc instanceof LOCModel ? data.loc : new LOCModel(data.loc)
        });
    }

    message() {
        switch (this.get('action')) {
            case ADDED:
                return 'LOC "' + this.get('loc').name() + '" Added';
            case REMOVED:
                return 'LOC "' + this.get('loc').name() + '" Removed';
            case UPDATED:
            default:
                return 'LOC "' + this.get('loc').name() + '" Updated. New '
                    + this.get('params').valueName + ' = ' + this.get('params').value;
        }
    };
}

export default LOCNoticeModel;