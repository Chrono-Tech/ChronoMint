import {Map} from 'immutable';
import reducer, * as a from '../../../../src/redux/ducks/settings/cbe';
import CBEModel from '../../../../src/models/CBEModel';

let cbe = new CBEModel({address: '0x123', name: 'Test'});

let list = new Map();
list = list.set(cbe.address(), cbe);

describe('settings cbe reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual({
            list: new Map(),
            selected: new CBEModel(),
            error: false,
            isReady: false,
            isFetching: false,
            isRemove: false
        });
    });

    it('should handle CBE_LIST', () => {
        expect(
            reducer([], {type: a.CBE_LIST, list})
        ).toEqual({
            list,
            isReady: true
        });
    });

    it('should handle CBE_FORM', () => {
        expect(
            reducer([], {type: a.CBE_FORM, cbe})
        ).toEqual({
            selected: cbe
        });
    });

    it('should handle CBE_REMOVE_TOGGLE', () => {
        expect(a.removeCBEToggle(cbe)).toEqual({type: a.CBE_REMOVE_TOGGLE, cbe});

        expect(
            reducer([], a.removeCBEToggle(cbe))
        ).toEqual({
            selected: cbe,
            isRemove: true
        });

        expect(
            reducer({selected: cbe}, a.removeCBEToggle(null))
        ).toEqual({
            selected: new CBEModel(),
            isRemove: false
        });
    });

    it('should handle CBE_UPDATE', () => {
        expect(
            reducer({list: new Map()}, {type: a.CBE_UPDATE, cbe})
        ).toEqual({
            list
        });
    });

    it('should handle CBE_REMOVE', () => {
        expect(
            reducer({list}, {type: a.CBE_REMOVE, cbe})
        ).toEqual({
            list: new Map()
        });
    });

    it('should handle CBE_ERROR', () => {
        expect(
            reducer([], {type: a.CBE_ERROR})
        ).toEqual({
            error: true
        });
    });

    it('should handle CBE_HIDE_ERROR', () => {
        expect(
            reducer([], {type: a.CBE_HIDE_ERROR})
        ).toEqual({
            error: false
        });
    });

    it('should handle CBE_FETCH_START', () => {
        expect(
            reducer([], {type: a.CBE_FETCH_START})
        ).toEqual({
            isFetching: true
        });
    });

    it('should handle CBE_FETCH_END', () => {
        expect(
            reducer([], {type: a.CBE_FETCH_END})
        ).toEqual({
            isFetching: false
        });
    });
});