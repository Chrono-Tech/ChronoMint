import {Map} from 'immutable';
import reducer, * as actions from '../../../../src/redux/ducks/settings/tokens';
import TokenContractModel from '../../../../src/models/contracts/TokenContractModel';

const token = new TokenContractModel({address: '0x123', symbol: 'TIME'});
let list = new Map();
list = list.set(token.address(), token);

describe('settings tokens reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual({
            list: new Map(),
            selected: new TokenContractModel(),
            balances: new Map(),
            balancesNum: 0,
            balancesPageCount: 0,
            error: false
        });
    });

    it('should handle TOKENS_LIST', () => {
        expect(
            reducer([], {type: actions.TOKENS_LIST, list})
        ).toEqual({
            list
        });
    });

    it('should handle TOKENS_VIEW', () => {
        expect(
            reducer([], {type: actions.TOKENS_VIEW, token})
        ).toEqual({
            selected: token
        });
    });

    it('should handle TOKENS_FORM', () => {
        expect(
            reducer([], {type: actions.TOKENS_FORM, token})
        ).toEqual({
            selected: token
        });
    });

    it('should handle TOKENS_BALANCES_NUM', () => {
        expect(
            reducer([], {type: actions.TOKENS_BALANCES_NUM, num: 180, pages: 2})
        ).toEqual({
            balancesNum: 180,
            balancesPageCount: 2
        });
    });

    it('should handle TOKENS_BALANCES', () => {
        let balances = new Map();
        balances = balances.set('0x321', 1000);
        expect(
            reducer([], {type: actions.TOKENS_BALANCES, balances})
        ).toEqual({
            balances
        });
    });

    it('should handle TOKENS_UPDATE', () => {
        expect(
            reducer({list: new Map()}, {type: actions.TOKENS_UPDATE, token})
        ).toEqual({
            list
        });
    });

    it('should handle TOKENS_REMOVE', () => {
        expect(
            reducer({list}, {type: actions.TOKENS_REMOVE, token})
        ).toEqual({
            list: new Map()
        });
    });

    it('should handle TOKENS_ERROR', () => {
        expect(
            reducer([], {type: actions.TOKENS_ERROR, address: token.address()})
        ).toEqual({
            error: token.address()
        });
    });

    it('should handle TOKENS_HIDE_ERROR', () => {
        expect(
            reducer([], {type: actions.TOKENS_HIDE_ERROR})
        ).toEqual({
            error: false
        });
    });
});