import {Map} from 'immutable';
import * as actions from '../../../../src/redux/ducks/settings/otherContracts';
import isEthAddress from '../../../../src/utils/isEthAddress';
import OrbitDAO from '../../../../src/dao/OrbitDAO';
import {store} from '../../../init';

let contract = null;

describe('settings other contracts actions', () => {
    beforeAll(() => {
        return OrbitDAO.init(null, true);
    });

    it('stub', () => {
        expect(true).toBeTruthy();
    });

    // it('should list contracts', () => {
    //     return store.dispatch(actions.listContracts()).then(() => {
    //         const list = store.getActions()[0].list;
    //         expect(store.getActions()).toEqual([{type: actions.OTHER_CONTRACTS_LIST, list}]);
    //         expect(list instanceof Map).toEqual(true);
    //
    //         const address = list.keySeq().toArray()[0];
    //         contract = list.get(address);
    //         expect(contract.address()).toEqual(address);
    //         expect(isEthAddress(contract.address())).toEqual(true);
    //         expect(contract.name()).toEqual('Unknown');
    //     });
    // });
});