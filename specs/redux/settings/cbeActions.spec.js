import {Map} from 'immutable';
import * as modal from '../../../src/redux/ui/modal';
import * as notifier from '../../../src/redux/notifier/notifier';
import * as a from '../../../src/redux/settings/cbe';
import isEthAddress from '../../../src/utils/isEthAddress';
import UserDAO from '../../../src/dao/UserDAO';
import PendingManagerDAO from '../../../src/dao/PendingManagerDAO';
import CBEModel from '../../../src/models/CBEModel';
import UserModel from '../../../src/models/UserModel';
import {store} from '../../init';

const accounts = UserDAO.getAccounts();
const user = new UserModel({name: Math.random().toString()});
const cbe = new CBEModel({address: accounts[1], name: user.name(), user});

describe('settings cbe actions', () => {
    it('should list CBEs', () => {
        return store.dispatch(a.listCBE()).then(() => {
            const list = store.getActions()[2].list;
            expect(list instanceof Map).toBeTruthy();

            const address = list.keySeq().toArray()[0];
            expect(isEthAddress(address)).toBeTruthy();
            expect(list.get(address).address()).toEqual(address);
        });
    });

    it('should treat CBE', () => {
        return new Promise(resolve => {
            UserDAO.watchCBE((updatedCBE, ts, isRevoked, isOld) => {
                if (!isOld && !isRevoked) {
                    expect(updatedCBE).toEqual(cbe);
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(a.treatCBE(cbe, accounts[0])).then(() => {
                expect(store.getActions()[2]).not.toEqual({type: a.CBE_ERROR});
            });
        });
    });

    it('should show CBE form', () => {
        store.dispatch(a.formCBE(cbe));
        expect(store.getActions()).toEqual([
            {type: a.CBE_FORM, cbe},
            {type: modal.MODAL_SHOW, payload: {modalType: modal.SETTINGS_CBE_TYPE, modalProps: undefined}}
        ]);
    });

    it('should show load name to CBE form', () => {
        return store.dispatch(a.formCBELoadName(cbe.address())).then(() => {
            expect(store.getActions()).toEqual([{
                'meta': {
                    'field': 'name',
                    'form': 'SettingsCBEAddressForm',
                    'persistentSubmitErrors': undefined,
                    'touch': undefined
                }, 'payload': 'loading...', 'type': '@@redux-form/CHANGE'
            }, {
                'meta': {
                    'field': 'name',
                    'form': 'SettingsCBEAddressForm',
                    'persistentSubmitErrors': undefined,
                    'touch': undefined
                }, 'payload': cbe.name(), 'type': '@@redux-form/CHANGE'
            }])
        });
    });

    it('should revoke CBE', () => {
        return new Promise(resolve => {
            UserDAO.watchCBE((revokedCBE, ts, isRevoked) => {
                if (isRevoked) {
                    expect(revokedCBE).toEqual(cbe);
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(a.revokeCBE(cbe, accounts[0])).then(() => {
                expect(store.getActions()).toEqual([
                    {type: a.CBE_REMOVE_TOGGLE, cbe: null},
                    {type: a.CBE_FETCH_START},
                    {type: a.CBE_FETCH_END, hash: store.getActions()[2].hash}
                ]);

                PendingManagerDAO.confirm(store.getActions()[2].hash, accounts[1]).then(result => {
                    expect(result).toBeTruthy();
                });
            });
        });
    });

    it('should create a notice and dispatch CBE when updated', () => {
        store.dispatch(a.watchCBE(cbe, null, false, false));
        expect(store.getActions()).toEqual([
            {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: a.CBE_UPDATE, cbe}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.cbe()).toEqual(cbe);
        expect(notice.isRevoked()).toBeFalsy();

        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create a notice and dispatch CBE when revoked', () => {
        store.dispatch(a.watchCBE(cbe, null, true, false));
        expect(store.getActions()).toEqual([
            {type: notifier.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifier.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: a.CBE_REMOVE, cbe}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.cbe()).toEqual(cbe);
        expect(notice.isRevoked()).toBeTruthy();

        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create an action to update cbe', () => {
        expect(a.updateCBE(cbe)).toEqual({type: a.CBE_UPDATE, cbe});
    });

    it('should create an action to remove cbe', () => {
        expect(a.removeCBE(cbe)).toEqual({type: a.CBE_REMOVE, cbe});
    });

    it('should create an action to toggle remove cbe dialog', () => {
        expect(a.removeCBEToggle(cbe)).toEqual({type: a.CBE_REMOVE_TOGGLE, cbe});
    });

    it('should create an action to show a error', () => {
        expect(a.showCBEError()).toEqual({type: a.CBE_ERROR});
    });

    it('should create an action to hide a error', () => {
        expect(a.hideCBEError()).toEqual({type: a.CBE_HIDE_ERROR});
    });

    it('should create an action to flag fetch start', () => {
        expect(a.fetchCBEStart()).toEqual({type: a.CBE_FETCH_START});
    });

    it('should create an action to flag fetch end', () => {
        expect(a.fetchCBEEnd()).toEqual({type: a.CBE_FETCH_END, hash: null});
    });
});