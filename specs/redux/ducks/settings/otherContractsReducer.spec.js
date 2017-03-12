import {Map} from 'immutable';
import reducer, * as actions from '../../../../src/redux/ducks/settings/otherContracts';
import DefaultContractModel from '../../../../src/models/contracts/RewardsContractModel';

let contract = new DefaultContractModel({address: '0x123', name: 'Test'});
let list = new Map();
list = list.set(contract.address(), contract);

describe('settings other contracts reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual({
            list: new Map(),
            ready: false,
            selected: new DefaultContractModel(),
            error: false,
            remove: false
        });
    });

    it('should handle OTHER_CONTRACTS_LIST', () => {
        expect(
            reducer([], {type: actions.OTHER_CONTRACTS_LIST, list})
        ).toEqual({
            list,
            ready: true
        });
    });

    it('should handle OTHER_CONTRACTS_FORM', () => {
        expect(
            reducer([], {type: actions.OTHER_CONTRACTS_FORM, contract})
        ).toEqual({
            selected: contract
        });
    });

    it('should handle OTHER_CONTRACTS_UPDATE', () => {
        expect(
            reducer({list: new Map()}, {type: actions.OTHER_CONTRACTS_UPDATE, contract})
        ).toEqual({
            list
        });
    });

    it('should handle OTHER_CONTRACTS_REMOVE', () => {
        expect(
            reducer({list}, {type: actions.OTHER_CONTRACTS_REMOVE, contract})
        ).toEqual({
            list: new Map()
        });
    });

    it('should handle OTHER_CONTRACTS_REMOVE_TOGGLE', () => {
        expect(
            reducer([], {type: actions.OTHER_CONTRACTS_REMOVE_TOGGLE, contract})
        ).toEqual({
            selected: contract,
            remove: true
        });

        expect(
            reducer({selected: contract}, {type: actions.OTHER_CONTRACTS_REMOVE_TOGGLE, contract: null})
        ).toEqual({
            selected: new DefaultContractModel(),
            remove: false
        });
    });

    it('should handle OTHER_CONTRACTS_ERROR', () => {
        expect(
            reducer([], {type: actions.OTHER_CONTRACTS_ERROR, address: contract.address()})
        ).toEqual({
            error: contract.address()
        });
    });

    it('should handle OTHER_CONTRACTS_HIDE_ERROR', () => {
        expect(
            reducer([], {type: actions.OTHER_CONTRACTS_HIDE_ERROR})
        ).toEqual({
            error: false
        });
    });
});