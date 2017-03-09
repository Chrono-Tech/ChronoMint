import {Map} from 'immutable';
import * as modalActions from '../../../../src/redux/ducks/ui/modal';
import * as notifierActions from '../../../../src/redux/ducks/notifier/notifier';
import * as actions from '../../../../src/redux/ducks/settings/cbe';
import isEthAddress from '../../../../src/utils/isEthAddress';
import AppDAO from '../../../../src/dao/AppDAO';
import OrbitDAO from '../../../../src/dao/OrbitDAO';
import CBEModel from '../../../../src/models/CBEModel';
import UserModel from '../../../../src/models/UserModel';
import {store} from '../../../init';

const accounts = AppDAO.web3.eth.accounts;
const user = new UserModel({name: Math.random().toString()});
const cbe = new CBEModel({address: accounts[1], name: user.name(), user});

describe('settings cbe actions', () => {
    beforeAll(() => {
        return OrbitDAO.init(null, true);
    });

    it('should list CBEs', () => {
        return store.dispatch(actions.listCBE()).then(() => {
            const list = store.getActions()[0].list;
            expect(store.getActions()).toEqual([{type: actions.CBE_LIST, list}]);
            expect(list instanceof Map).toBeTruthy();

            const address = list.keySeq().toArray()[0];
            expect(isEthAddress(address)).toBeTruthy();
            expect(list.get(address).address()).toEqual(address);
        });
    });

    it('should treat CBE', () => {
        return new Promise(resolve => {
            AppDAO.watchUpdateCBE((updatedCBE, ts, revoke) => {
                if (!revoke) {
                    expect(updatedCBE).toEqual(cbe);
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(actions.treatCBE(cbe, accounts[0])).then(() => {
                expect(store.getActions()[0]).not.toEqual({type: actions.CBE_ERROR});
            });
        });
    });

    it('should show CBE form', () => {
        store.dispatch(actions.formCBE(cbe));
        expect(store.getActions()).toEqual([
            {type: actions.CBE_FORM, cbe},
            {type: modalActions.MODAL_SHOW, payload: {modalType: modalActions.SETTINGS_CBE_TYPE, modalProps: undefined}}
        ]);
    });

    it('should revoke CBE', () => {
        return new Promise(resolve => {
            AppDAO.watchUpdateCBE((revokedCBE, ts, revoke) => {
                if (revoke) {
                    expect(revokedCBE).toEqual(new CBEModel({address: cbe.address()}));
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(actions.revokeCBE(cbe, accounts[0])).then(() => {
                store.dispatch(actions.revokeCBE(cbe, accounts[1])).then(() => {
                    expect(store.getActions()).toEqual([
                        {type: actions.CBE_REMOVE_TOGGLE, cbe: null},
                        {type: actions.CBE_REMOVE_TOGGLE, cbe: null},
                    ]);
                });
            });
        });
    });

    it('should create a notice and dispatch CBE when updated', () => {
        store.dispatch(actions.watchUpdateCBE(cbe, null, false));
        expect(store.getActions()).toEqual([
            {type: notifierActions.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifierActions.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: actions.CBE_UPDATE, cbe}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.cbe).toEqual(cbe);
        expect(notice.revoke).toBeFalsy();

        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create an action to update cbe', () => {
        expect(actions.updateCBE(cbe)).toEqual({type: actions.CBE_UPDATE, cbe});
    });

    it('should create an action to remove cbe', () => {
        expect(actions.removeCBE(cbe)).toEqual({type: actions.CBE_REMOVE, cbe});
    });

    it('should create an action to toggle remove cbe dialog', () => {
        expect(actions.removeCBEToggle(cbe)).toEqual({type: actions.CBE_REMOVE_TOGGLE, cbe});
    });

    it('should create an action to show a error', () => {
        expect(actions.showCBEError()).toEqual({type: actions.CBE_ERROR});
    });

    it('should create an action to hide a error', () => {
        expect(actions.hideCBEError()).toEqual({type: actions.CBE_HIDE_ERROR});
    });
});