import * as actions from '../../../../src/redux/ducks/ui/modal';
import {store} from '../../../init';

describe('Modal actions', () => {

    it('should show Change Number Signatures Modal', () => {
        store.dispatch(actions.showChangeNumberSignaturesModal());
        expect(store.getActions()).toEqual([{"payload": {"modalProps": undefined,
            "modalType": "modals/SIGNATURES_NUMBER_TYPE"}, "type": "modal/SHOW"}]);
    });

});


