import * as actions from '../../../../src/redux/pendings/actions';
import UserDAO from '../../../../src/dao/UserDAO';
import {store} from '../../../init';

const account = UserDAO.web3.eth.accounts[0];

describe('pendings actions', () => {

    it('should set required signatures', () => {
        store.dispatch(actions.setRequiredSignatures(2, account, ()=>{})).then(() => {
            expect(store.getActions()).toEqual(["locs/LOAD_START"]);
        });
    });

});