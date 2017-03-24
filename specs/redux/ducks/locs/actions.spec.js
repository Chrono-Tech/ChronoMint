import * as actions from '../../../../src/redux/ducks/locs/actions';
import { createAllLOCsAction, createLOCAction, updateLOCAction, removeLOCAction } from '../../../../src/redux/ducks/locs/reducer';
import UserDAO from '../../../../src/dao/UserDAO';
import LOCsManagerDAO from '../../../../src/dao/LOCsManagerDAO';
import {store} from '../../../init';
import isEthAddress from '../../../../src/utils/isEthAddress';
import LOCModel from '../../../../src/models/LOCModel';

const accounts = UserDAO.web3.eth.accounts;
let address;

describe('LOCs actions', () => {

    it('should propose new LOC', (done) => {
        LOCsManagerDAO.newLOCWatch((locModel) => {
            expect(locModel.locName).toEqual("Bob's Hard Workers");
            address = locModel.address;
            done();
        });

        const data = { locName: "Bob's Hard Workers", website: "www.ru", issueLimit: 1000,
            publishedHash: "QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB",
            expDate: 1484554656, account: accounts[0]
        };
        store.dispatch(actions.submitLOC(data, ()=>{}));
    });

    it('should fetch LOCs', () => {
        return store.dispatch(actions.getLOCs(accounts[0])).then(() => {
            expect(store.getActions()[0].type).toEqual("locs/LOAD_START");
            expect(store.getActions()[1].type).toEqual(createAllLOCsAction().type);
            const address_ = store.getActions()[1].data.keySeq().toArray()[0];
            expect(isEthAddress(address_)).toBeTruthy();
            expect(store.getActions()[2].type).toEqual("locs/LOAD_SUCCESS");
        });
    });

    it('should update LOC', (done) => {
        LOCsManagerDAO.updLOCValueWatch((locAddr, settingName, value) => {
            expect(locAddr).toEqual(address);
            // expect(settingName).toEqual("issueLimit");
            expect(value).toEqual(2000);
            done();
        });

        const data = { address, issueLimit: 2000, account: accounts[0] };
        store.dispatch(actions.submitLOC(data, ()=>{}));
    });

    it('should remove LOC', (done) => {
        LOCsManagerDAO.remLOCWatch((r) => {
            expect(r).toEqual(address);
            done();
        });

        store.dispatch(actions.removeLOC(address, accounts[0], ()=>{}));
    });

    it('should create an action to show what LOC is created', () => {
        const locModel = new LOCModel({address: 0x10});
        store.dispatch(actions.handleNewLOC(locModel, 995));
        expect(store.getActions()[0]).toEqual({data: locModel, type: "loc/CREATE"});
    });

    it('should create an action to show what LOC is created 2', () => {
        const locModel = new LOCModel({address: 0x10});
        expect(createLOCAction(locModel)).toEqual({data: locModel, type: "loc/CREATE"});
    });

    it('should create an action to show what LOC is updated', () => {
        expect(updateLOCAction({website: "www.com"})).toEqual({data: {website: "www.com"}, type: "loc/UPDATE"});
    });

    it('should create an action to show what LOC is removed', () => {
        expect(removeLOCAction({address})).toEqual({data: {address}, type: "loc/REMOVE"});
    });
});