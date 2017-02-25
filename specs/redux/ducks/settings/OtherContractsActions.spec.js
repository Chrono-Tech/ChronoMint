import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Map} from 'immutable';
import * as actions from '../../../../src/redux/ducks/settings/otherContracts';
import isEthAddress from '../../../../src/utils/isEthAddress';

const mockStore = configureMockStore([thunk]);
let store = null;
let contract = null;

describe('settings other contracts actions', () => {
    beforeEach(() => {
        store = mockStore();
        localStorage.clear();
    });

    it('should list contracts', () => {
        return store.dispatch(actions.listContracts()).then(() => {
            const list = store.getActions()[0].list;
            expect(store.getActions()).toEqual([{type: actions.OTHER_CONTRACTS_LIST, list}]);
            expect(list instanceof Map).toEqual(true);

            const address = list.keySeq().toArray()[0];
            contract = list.get(address);
            expect(contract.address()).toEqual(address);
            expect(isEthAddress(contract.address())).toEqual(true);
            expect(contract.name()).toEqual('Unknown');
        });
    });
});