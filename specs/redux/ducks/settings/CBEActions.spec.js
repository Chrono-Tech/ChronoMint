import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Map} from 'immutable';
import * as modalActions from '../../../../src/redux/ducks/ui/modal';
import * as notifierActions from '../../../../src/redux/ducks/notifier/notifier';
import * as actions from '../../../../src/redux/ducks/settings/cbe';
import isEthAddress from '../../../../src/utils/isEthAddress';
import AppDAO from '../../../../src/dao/AppDAO';
import CBEModel from '../../../../src/models/CBEModel';

const mockStore = configureMockStore([thunk]);
const accounts = AppDAO.web3.eth.accounts;
const cbe = new CBEModel({address: accounts[1], name: Math.random().toString()});
let store = null;

describe('settings cbe actions', () => {
    beforeEach(() => {
        store = mockStore();
        localStorage.clear();
    });

    it('should list CBEs', () => {
        return store.dispatch(actions.listCBE()).then(() => {
            const list = store.getActions()[0].list;
            expect(store.getActions()).toEqual([{type: actions.CBE_LIST, list}]);
            expect(list instanceof Map).toEqual(true);

            const address = list.keySeq().toArray()[0];
            expect(isEthAddress(address)).toEqual(true);
            expect(list.get(address).address()).toEqual(address);
        });
    });

    it('should treat and watch CBE', () => {
        return new Promise(resolve => {
            AppDAO.watchUpdateCBE((newCBE) => {
                expect(newCBE).toEqual(cbe);
                resolve();
            }, null, accounts[0]);

            store.dispatch(actions.treatCBE(cbe, accounts[0])).then(() => {
                expect(store.getActions()).toEqual([]);
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
        return store.dispatch(actions.revokeCBE(cbe, accounts[0])).then(() => {
            expect(store.getActions()).toEqual([
                {type: actions.CBE_REMOVE_TOGGLE, cbe: null}
            ]);
        });
    });

    it('should not revoke current CBE', () => {
        return store.dispatch(actions.revokeCBE(new CBEModel({address: accounts[0]}), accounts[0])).then(() => {
            expect(store.getActions()).toEqual([
                {type: actions.CBE_REMOVE_TOGGLE, cbe: null},
                actions.showError()
            ]);
        });
    });

    it('should create a notice and dispatch new CBE when updated', () => {
        store.dispatch(actions.watchUpdateCBE(cbe));
        expect(store.getActions()).toEqual([
            {type: notifierActions.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifierActions.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: actions.CBE_UPDATE, cbe}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.cbe).toEqual(cbe);
        expect(notice.revoke).toEqual(false);

        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create a notice and dispatch affected CBE when revoked', () => {
        store.dispatch(actions.watchRevokeCBE(cbe));
        expect(store.getActions()).toEqual([
            {type: notifierActions.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifierActions.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: actions.CBE_REMOVE, cbe}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.cbe).toEqual(cbe);
        expect(notice.revoke).toEqual(true);

        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create an action to update cbe', () => {
        expect(actions.updateCBE(cbe)).toEqual({type: actions.CBE_UPDATE, cbe});
    });

    it('should create an action to remove cbe', () => {
        expect(actions.removeCBE(cbe)).toEqual({type: actions.CBE_REMOVE, cbe});
    });

    it('should create an action to show a error', () => {
        expect(actions.showError()).toEqual({type: actions.CBE_ERROR});
    });

    it('should create an action to hide a error', () => {
        expect(actions.hideError()).toEqual({type: actions.CBE_HIDE_ERROR});
    });
});