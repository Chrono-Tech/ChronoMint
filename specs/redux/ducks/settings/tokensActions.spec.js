import {Map} from 'immutable';
import * as modalActions from '../../../../src/redux/ducks/ui/modal';
import * as notifierActions from '../../../../src/redux/ducks/notifier/notifier';
import * as actions from '../../../../src/redux/ducks/settings/tokens';
import isEthAddress from '../../../../src/utils/isEthAddress';
import TokenContractsDAO from '../../../../src/dao/TokenContractsDAO';
import TokenContractModel from '../../../../src/models/contracts/TokenContractModel';
import {store} from '../../../init';

const accounts = TokenContractsDAO.getAccounts();
let token = null; /** @see TokenContractModel */
let token2 = null;
let holder = null;
let balance = null;

describe('settings tokens actions', () => {
    it('should list tokens', () => {
        return store.dispatch(actions.listTokens()).then(() => {
            const list = store.getActions()[2].list;
            expect(list instanceof Map).toBeTruthy();

            const address = list.keySeq().toArray()[0];
            token = list.get(address);
            token2 = list.get(list.keySeq().toArray()[1]);
            expect(token.address()).toEqual(address);
            expect(isEthAddress(token.address())).toBeTruthy();
        });
    });

    it('should list balances', () => {
        return store.dispatch(actions.listTokenBalances(token)).then(() => {
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

            expect(balances.size).toBeLessThanOrEqual(num.num);
            expect(balances.size).toBeLessThanOrEqual(100);
            expect(num.pages).toEqual(Math.ceil(num.num / 100));

            holder = balances.keySeq().toArray()[0];
            balance = balances.get(holder);
        });
    });

    it('should list balances with address filter', () => {
        return store.dispatch(actions.listTokenBalances(token, 0, holder)).then(() => {
            expect(store.getActions()[1]).toEqual({
                type: actions.TOKENS_BALANCES_NUM, num: 1, pages: 1
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
        return store.dispatch(actions.listTokenBalances(token, 0, '0xinvalid')).then(() => {
            expect(store.getActions()[1]).toEqual({
                type: actions.TOKENS_BALANCES_NUM, num: 0, pages: 0
            });
            expect(store.getActions()[2]).toEqual({
                type: actions.TOKENS_BALANCES,
                balances: new Map()
            });
        });
    });

    it('should open view token modal', () => {
        return store.dispatch(actions.viewToken(token)).then(() => {
            const view = store.getActions()[2];
            expect(view).toEqual({
                type: actions.TOKENS_VIEW,
                token: view.token
            });
            expect(view.token.address()).toEqual(token.address());
            expect(view.token.name().length).toBeGreaterThan(0);
            expect(view.token.totalSupply()).toBeGreaterThanOrEqual(0);

            expect(store.getActions()[3]).toEqual({
                type: modalActions.MODAL_SHOW,
                payload: {modalType: modalActions.SETTINGS_TOKEN_VIEW_TYPE, modalProps: undefined}
            });
        });
    });

    it('should show token form', () => {
        store.dispatch(actions.formToken(token));

        const view = store.getActions()[0];
        expect(view).toEqual({type: actions.TOKENS_FORM, token});

        expect(store.getActions()[1]).toEqual({
            type: modalActions.MODAL_SHOW,
            payload: {modalType: modalActions.SETTINGS_TOKEN_TYPE, modalProps: undefined}
        });
    });

    it('should remove token', () => {
        return new Promise(resolve => {
            TokenContractsDAO.watch((revokedToken, ts, isRevoked, isOld) => {
                if (!isOld && isRevoked) {
                    expect(revokedToken).toEqual(token2);
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(actions.removeToken(token2, accounts[0])).then(() => {
                expect(store.getActions()).toEqual([
                    {type: actions.TOKENS_FETCH_START},
                    {type: actions.TOKENS_REMOVE_TOGGLE, token: null},
                    {type: actions.TOKENS_FETCH_END}
                ]);
            });
        });
    });

    it('should modify token', () => {
        return new Promise(resolve => {
            TokenContractsDAO.watch((updatedToken, ts, isRevoked) => {
                if (!isRevoked && updatedToken.address() === token2.address()) {
                    expect(updatedToken).toEqual(token2);
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(actions.treatToken(token, token2.address(), accounts[0])).then(() => {
                expect(store.getActions()).toEqual([
                    {type: actions.TOKENS_FETCH_START},
                    {type: actions.TOKENS_FETCH_END}
                ]);
            });
        });
    });

    it('should add token', () => {
        return new Promise(resolve => {
            TokenContractsDAO.watch((addedToken, ts, isRevoked) => {
                if (!isRevoked && addedToken.address() === token.address()) {
                    expect(addedToken).toEqual(token);
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(actions.treatToken(new TokenContractModel(), token.address(), accounts[0])).then(() => {
                expect(store.getActions()).toEqual([
                    {type: actions.TOKENS_FETCH_START},
                    {type: actions.TOKENS_FETCH_END}
                ]);
            });
        });
    });

    it('should not modify token address on already added token address', () => {
        return store.dispatch(actions.treatToken(token, token2.address(), accounts[0])).then(() => {
            expect(store.getActions()).toEqual([
                {type: actions.TOKENS_FETCH_START},
                {type: actions.TOKENS_FETCH_END},
                {type: actions.TOKENS_ERROR, address: token2.address()}
            ]);
        });
    });

    it('should create a notice and dispatch token when updated', () => {
        store.dispatch(actions.watchToken(token, null, false, false));
        expect(store.getActions()).toEqual([
            {type: notifierActions.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifierActions.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: actions.TOKENS_UPDATE, token}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.token()).toEqual(token);
        expect(notice.isRevoked()).toBeFalsy();
        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create a notice and dispatch token when revoked', () => {
        store.dispatch(actions.watchToken(token, null, true, false));
        expect(store.getActions()).toEqual([
            {type: notifierActions.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifierActions.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: actions.TOKENS_REMOVE, token}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.token()).toEqual(token);
        expect(notice.isRevoked()).toBeTruthy();
        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create an action to show an error', () => {
        expect(actions.showTokenError(token.address())).toEqual({type: actions.TOKENS_ERROR, address: token.address()});
    });

    it('should create an action to hide an error', () => {
        expect(actions.hideTokenError()).toEqual({type: actions.TOKENS_HIDE_ERROR});
    });

    it('should create an action to toggle remove token dialog', () => {
        expect(actions.removeTokenToggle(token)).toEqual({type: actions.TOKENS_REMOVE_TOGGLE, token});
    });

    it('should create an action to update token balances num', () => {
        expect(actions.tokenBalancesNum(100, 1)).toEqual({type: actions.TOKENS_BALANCES_NUM, num: 100, pages: 1});
    });

    it('should create an action to flag fetch start', () => {
        expect(actions.fetchTokensStart()).toEqual({type: actions.TOKENS_FETCH_START});
    });

    it('should create an action to flag fetch end', () => {
        expect(actions.fetchTokensEnd()).toEqual({type: actions.TOKENS_FETCH_END});
    });
});