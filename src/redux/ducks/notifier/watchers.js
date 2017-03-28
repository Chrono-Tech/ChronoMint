import { notify } from './notifier';
import LOCNoticeModel, {ADDED, REMOVED, UPDATED} from '../../../models/notices/LOCNoticeModel';
import LOCsManagerDAO from '../../../dao/LOCsManagerDAO';
import LOCDAO, {Setting} from '../../../dao/LOCDAO';

const watchNewLOCNotify = (account: string) => (dispatch) => LOCsManagerDAO.contract.then(LOCsDeployed => {
    LOCsManagerDAO._watch(LOCsDeployed.newLOC, (r, block, time, isOld) => {
        const loc = new LOCDAO(r.args._LOC);
        loc.loadLOC(account).then(locModel => dispatch(
            notify(new LOCNoticeModel({time, loc: locModel, action: ADDED}), isOld)
        ));
    });
});

const watchRemoveLOCNotify = (account: string) => (dispatch) => LOCsManagerDAO.contract.then(LOCsDeployed => {
    LOCsManagerDAO._watch(LOCsDeployed.remLOC, (r, block, time, isOld) => {
        const loc = new LOCDAO(r.args._LOC);
        loc.loadLOC(account).then(locModel => {
            dispatch(notify(new LOCNoticeModel({time, loc: locModel, action: REMOVED}), isOld))
        });
    });
});

const watchUpdLOCStatusNotify = (account: string) => (dispatch) => LOCsManagerDAO.contract.then(LOCsDeployed => {
    LOCsManagerDAO._watch(LOCsDeployed.updLOCStatus, (r, block, time, isOld) => {
        const status = r.args._status.toNumber();
        dispatch(notifyUpdateLOCValue(r.args._LOC, 'status', status, time, isOld, account));
    });
});

const watchUpdLOCValueNotify = (account: string) => (dispatch) => LOCsManagerDAO.contract.then(LOCsDeployed => {
    LOCsManagerDAO._watch(LOCsDeployed.updLOCValue, (r, block, time, isOld) => {
        const value = r.args._value.toNumber();
        const setting = r.args._name.toNumber();
        const settingName = Setting.findKey( key => key === setting);
        dispatch(notifyUpdateLOCValue(r.args._LOC, settingName, value, time, isOld, account));
    });
});

const watchUpdLOCStringNotify = (account: string) => (dispatch) => LOCsManagerDAO.contract.then(LOCsDeployed => {
    LOCsManagerDAO._watch(LOCsDeployed.updLOCString, (r, block, time, isOld) => {
        const value = this._bytesToString(r.args._value);
        const setting = r.args._name.toNumber();
        const settingName = Setting.findKey( key => key === setting);
        dispatch(notifyUpdateLOCValue(r.args._LOC, settingName, value, time, isOld, account));
    });
});

const notifyUpdateLOCValue = (address, valueName, value, time, isOld, account) => (dispatch) => {
    const loc = new LOCDAO(address);
    loc.loadLOC(account).then(locModel => {
        dispatch(notify(new LOCNoticeModel({time, loc: locModel, action: UPDATED, params: {valueName, value} }), isOld))
    });
};

export {
    watchNewLOCNotify,
    watchRemoveLOCNotify,
    watchUpdLOCStatusNotify,
    watchUpdLOCValueNotify,
    watchUpdLOCStringNotify
}