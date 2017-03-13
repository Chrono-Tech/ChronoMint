import {Map} from 'immutable';
import * as actions from '../../../../src/redux/ducks/settings/otherContracts';
import * as modalActions from '../../../../src/redux/ducks/ui/modal';
import * as notifierActions from '../../../../src/redux/ducks/notifier/notifier';
import isEthAddress from '../../../../src/utils/isEthAddress';
import OrbitDAO from '../../../../src/dao/OrbitDAO';
import AppDAO from '../../../../src/dao/AppDAO';
import ExchangeContractModel from '../../../../src/models/contracts/ExchangeContractModel';
import {store} from '../../../init';

const accounts = AppDAO.web3.eth.accounts;
let contract = null; /** @see ExchangeContractModel */
let contractWithSettings = null;

describe('settings other contracts actions', () => {
    beforeAll(() => {
        return OrbitDAO.init(null, true);
    });

    it('should list contracts', () => {
        return store.dispatch(actions.listContracts()).then(() => {
            const list = store.getActions()[0].list;
            expect(store.getActions()).toEqual([{type: actions.OTHER_CONTRACTS_LIST, list}]);
            expect(list instanceof Map).toBeTruthy();

            const address = list.keySeq().toArray()[0];
            contract = list.get(address);
            expect(contract.address()).toEqual(address);
            expect(isEthAddress(contract.address())).toBeTruthy();

            if (!(contract instanceof ExchangeContractModel)) {
                contract = list.get(list.keySeq().toArray()[1]);
            }
            expect(contract.name()).toEqual('Exchange');
        });
    });

    it('should show contract form', () => {
        store.dispatch(actions.formContract(contract));

        const view = store.getActions()[0];
        expect(view).toEqual({type: actions.OTHER_CONTRACTS_FORM, contract});

        expect(store.getActions()[1]).toEqual({
            type: modalActions.MODAL_SHOW,
            payload: {modalType: modalActions.SETTINGS_OTHER_CONTRACT_TYPE, modalProps: undefined}
        })
    });

    it('should update Exchange contract settings', () => {
        contractWithSettings = contract.set('settings', {
            buyPrice: Math.round(Math.random() * 400) + 100,
            sellPrice: Math.round(Math.random() * 400) + 600
        });
        return store.dispatch(actions.saveContractSettings(contractWithSettings, accounts[0])).then(() => {
            expect(store.getActions()).toEqual([]);
        });
    });

    it('should show contract modify form with updated settings', () => {
        return store.dispatch(actions.formModifyContract(contract)).then(() => {
            let view = store.getActions()[0];
            expect(view.contract.settings()).toEqual(contractWithSettings.settings());
            expect(store.getActions()[1]).toEqual({
                type: modalActions.MODAL_SHOW,
                payload: {modalType: modalActions.SETTINGS_OTHER_CONTRACT_MODIFY_TYPE, modalProps: undefined}
            });
        });
    });

    it('should remove contract', () => {
        return new Promise(resolve => {
            AppDAO.watchUpdateOtherContract((revokedContract, ts, revoke) => {
                if (revoke) {
                    expect(revokedContract).toEqual(contract);
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(actions.removeContract(contract, accounts[0])).then(() => {
                expect(store.getActions()).toEqual([
                    {type: actions.OTHER_CONTRACTS_REMOVE_TOGGLE, contract: null}
                ]);
            });
        });
    });

    it('should add contract', () => {
        return new Promise(resolve => {
            AppDAO.watchUpdateOtherContract((addedContract, ts, revoke) => {
                if (!revoke) {
                    expect(addedContract).toEqual(contract);
                    resolve();
                }
            }, accounts[0]);

            store.dispatch(actions.addContract(contract.address(), accounts[0])).then(() => {
                expect(store.getActions()).toEqual([]);
            });
        });
    });

    it('should create a notice and dispatch contract when updated', () => {
        store.dispatch(actions.watchUpdateContract(contract, null, false));
        expect(store.getActions()).toEqual([
            {type: notifierActions.NOTIFIER_MESSAGE, notice: store.getActions()[0].notice},
            {type: notifierActions.NOTIFIER_LIST, list: store.getActions()[1].list},
            {type: actions.OTHER_CONTRACTS_UPDATE, contract}
        ]);

        const notice = store.getActions()[0].notice;
        expect(notice.contract).toEqual(contract);
        expect(notice.revoke).toEqual(false);
        expect(store.getActions()[1].list.get(0)).toEqual(notice);
    });

    it('should create an action to show contract form', () => {
        expect(actions.showContractForm(contract)).toEqual({type: actions.OTHER_CONTRACTS_FORM, contract});
    });

    it('should create an action to show an error', () => {
        expect(actions.showContractError(contract.address()))
            .toEqual({type: actions.OTHER_CONTRACTS_ERROR, address: contract.address()});
    });

    it('should create an action to hide an error', () => {
        expect(actions.hideContractError()).toEqual({type: actions.OTHER_CONTRACTS_HIDE_ERROR});
    });

    it('should create an action to toggle remove contract dialog', () => {
        expect(actions.removeContractToggle(contract)).toEqual({type: actions.OTHER_CONTRACTS_REMOVE_TOGGLE, contract});
    });
});