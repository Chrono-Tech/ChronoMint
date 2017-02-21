import {Map} from 'immutable';
import reducer from '../../src/redux/ducks/settings/cbe';
import CBEModel from '../../src/models/CBEModel';

describe('settings cbe reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual({
            list: new Map,
            form: new CBEModel,
            error: false,
            removeCBE: new CBEModel
        })
    });
});