import * as actions from '../../../../src/redux/ducks/locs/actions';
import { createAllLOCsAction, createLOCAction, updateLOCAction, removeLOCAction } from '../../../../src/redux/ducks/locs/reducer';
import UserDAO from '../../../../src/dao/UserDAO';
import LOCsManagerDAO from '../../../../src/dao/LOCsManagerDAO';
import {store} from '../../../init';
import isEthAddress from '../../../../src/utils/isEthAddress';
import LOCModel from '../../../../src/models/LOCModel';

const accounts = UserDAO.web3.eth.accounts;
const SUCCESS = "_SUCCESS";
const successAction = () => store.dispatch({type: SUCCESS});
let address;

describe('LOCs actions', () => {

    it('should propose new LOC', () => {
        const data = { locName: "Bob's Hard Workers", website: "www.ru", issueLimit: 1000,
            publishedHash: "QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB",
            expDate: 1484554656, account: accounts[0]
        };
        return store.dispatch(actions.submitLOC(data, successAction)).then((r) => {
            expect(r).toBeTruthy();
            expect(store.getActions()[0].type).toEqual(SUCCESS);
        });
    });

    it('should fetch LOCs', () => {
        return store.dispatch(actions.getLOCs(accounts[0])).then(() => {

            expect(store.getActions()[0].type).toEqual("locs/LOAD_START");
            expect(store.getActions()[1].type).toEqual(createAllLOCsAction().type);
            address = store.getActions()[1].data.keySeq().toArray()[0];
            expect(isEthAddress(address)).toBeTruthy();
            expect(store.getActions()[2].type).toEqual("locs/LOAD_SUCCESS");
        });
    });

    it('should update LOC', () => {
        return new Promise(resolve => {
            LOCsManagerDAO.updLOCValueWatch((locAddr, settingName, value) => {
                resolve({locAddr, settingName, value});
            });

            const data = { address, issueLimit: 2000, account: accounts[0] };
            store.dispatch(actions.submitLOC(data, ()=>{}));
        }).then ( ({locAddr, settingName, value}) => {
            expect(locAddr).toEqual(address);
            // expect(settingName).toEqual("issueLimit");
            // expect(value).toEqual(2000);
        })
    });

    it('should remove LOC', () => {
        return new Promise(resolve => {
            LOCsManagerDAO.remLOCWatch((r) => {
                resolve(r);
            });

            store.dispatch(actions.removeLOC(address, accounts[0], ()=>{}));
        }).then ( r => {
            expect(r).toEqual(address);
        })
    });

    it('should create an action to show what LOC is created', () => {
        const locModel = new LOCModel({address: 0x10});
        store.dispatch(actions.handleNewLOC(locModel, 995));
        expect(store.getActions()[0]).toEqual({data: locModel, type: "loc/CREATE"});
    });

    it('should create an action to show what LOC is updated', () => {
        expect(updateLOCAction({website: "www.com"})).toEqual({data: {website: "www.com"}, type: "loc/UPDATE"});
    });

    it('should create an action to show what LOC is removed', () => {
        expect(removeLOCAction({address})).toEqual({data: {address}, type: "loc/REMOVE"});
    });
});