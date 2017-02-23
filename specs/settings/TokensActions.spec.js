import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Map} from 'immutable';
import * as modalActions from '../../src/redux/ducks/ui/modal';
import * as notifierActions from '../../src/redux/ducks/notifier/notifier';
import * as actions from '../../src/redux/ducks/settings/tokens';
import isEthAddress from '../../src/utils/isEthAddress';
import AppDAO from '../../src/dao/AppDAO';

const mockStore = configureMockStore([thunk]);
const accounts = AppDAO.web3.eth.accounts;
let store = null;
let token = null;
let holder = null;
let balance = null;

describe('settings tokens actions', () => {
    beforeEach(() => {
        store = mockStore();
        localStorage.clear();
    });

    it('should list tokens', () => {
        return store.dispatch(actions.listTokens()).then(() => {
            const list = store.getActions()[0].list;
            expect(store.getActions()).toEqual([{type: actions.TOKENS_LIST, list}]);
            expect(list instanceof Map).toEqual(true);

            const symbol = list.keySeq().toArray()[0];
            token = list.get(symbol);
            expect(token.symbol()).toEqual(symbol);
            expect(isEthAddress(token.address())).toEqual(true);
        });
    });

    it('should list balances', () => {
        return store.dispatch(actions.listBalances(token)).then(() => {
            expect(store.getActions()[0]).toEqual({
                type: actions.TOKENS_BALANCES,
                balances: new Map({'Loading...': null})
            });

            const num = store.getActions()[1];
            expect(num).toEqual({
                type: actions.TOKENS_BALANCES_NUM,
                num: num.num,
                pages: num.pages
            });

            const list = store.getActions()[2];
            const balances = list.balances;
            expect(list).toEqual({
                type: actions.TOKENS_BALANCES,
                balances
            });

            expect(num.num).toBeLessThanOrEqual(balances.size);
            expect(balances.size).toBeLessThanOrEqual(100);
            expect(num.pages).toEqual(Math.ceil(num.num / 100));

            holder = balances.keySeq().toArray()[0];
            balance = balances.get(holder);
        });
    });

    it('should list balances with address filter', () => {
        return store.dispatch(actions.listBalances(token, 0, holder)).then(() => {
            expect(store.getActions()[1]).toEqual({
                type: actions.TOKENS_BALANCES_NUM,
                num: 1,
                pages: 0
            });

            let expected = new Map();
            expected = expected.set(holder, balance);
            expect(store.getActions()[2]).toEqual({
                type: actions.TOKENS_BALANCES,
                balances: expected
            });
        });
    });

    it('should not list balances with invalid address filter', () => {
        return store.dispatch(actions.listBalances(token, 0, '0xinvalid')).then(() => {
            expect(store.getActions()[1]).toEqual({
                type: actions.TOKENS_BALANCES_NUM,
                num: 1,
                pages: 0
            });
            expect(store.getActions()[2]).toEqual({
                type: actions.TOKENS_BALANCES,
                balances: new Map()
            });
        });
    });

    it('should open view token modal', () => {
        return store.dispatch(actions.viewToken(token)).then(() => {
            const view = store.getActions()[0];
            expect(view).toEqual({
                type: actions.TOKENS_VIEW,
                token: view.token
            });
            expect(view.token.address()).toEqual(token.address());
            expect(view.token.name().length).toBeGreaterThan(0);
            expect(view.token.totalSupply()).toBeGreaterThanOrEqual(0);

            expect(store.getActions()[1]).toEqual({
                type: modalActions.MODAL_SHOW,
                payload: {modalType: modalActions.SETTINGS_TOKEN_VIEW_TYPE, modalProps: undefined}
            })
        });
    });

    it('should show token form', () => {
        store.dispatch(actions.formToken(token));

        const view = store.getActions()[0];
        expect(view).toEqual({
            type: actions.TOKENS_FORM,
            token: token
        });

        expect(store.getActions()[1]).toEqual({
            type: modalActions.MODAL_SHOW,
            payload: {modalType: modalActions.SETTINGS_TOKEN_TYPE, modalProps: undefined}
        })
    });

    it('should treat and watch token', () => {
        return new Promise(resolve => {
            AppDAO.watchUpdateToken((newToken) => {
                expect(newToken).toEqual(token);
                resolve();
            });

            // TODO Change address and resolve from watch above
            store.dispatch(actions.treatToken(token, token.address(), accounts[0])).then(() => {
                expect(store.getActions()).toEqual([]);
                resolve();
            });
        });
    });

    it('should create a notice and dispatch token when updated', () => {
        store.dispatch(actions.watchUpdateToken(token));
        expect(store.getActions()).toEqual([
            {type: notifierActions.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifierActions.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: actions.TOKENS_WATCH_UPDATE, token}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.token).toEqual(token);

        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create an action to show a error', () => {
        expect(actions.errorToken()).toEqual({type: actions.TOKENS_ERROR});
    });

    it('should create an action to hide a error', () => {
        expect(actions.hideError()).toEqual({type: actions.TOKENS_HIDE_ERROR});
    });
});