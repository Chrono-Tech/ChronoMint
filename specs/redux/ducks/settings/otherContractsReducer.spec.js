import {Map} from 'immutable';
import reducer, * as actions from '../../../../src/redux/ducks/settings/otherContracts';
import ContractModel from '../../../../src/models/contracts/AbstractContractModel';

//let contract = new ContractModel({address: '0x123', name: 'Test'});

let list = new Map();
//list = list.set(contract.address(), contract);

describe('settings other contracts reducer', () => {
    it('stub', () => {
        expect(true).toBeTruthy();
    });

    // it('should return the initial state', () => {
    //     expect(
    //         reducer(undefined, {})
    //     ).toEqual({
    //         list: new Map()
    //     });
    // });
    //
    // it('should handle OTHER_CONTRACTS_LIST', () => {
    //     expect(
    //         reducer([], {type: actions.OTHER_CONTRACTS_LIST, list})
    //     ).toEqual({
    //         list
    //     });
    // });
});