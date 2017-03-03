import {Record as record} from 'immutable';
import BigNumber from 'bignumber.js';

//  TODO CHANGE DEFAULT REMOVE TEST
class LOCModel extends record({
    address: null,
    hasConfirmed: null,
    locName: 'Default LOC name',
    website: 'http://www.default.com',
    controller: null,
    issueLimit: new BigNumber(1000),
    issued: new BigNumber(0),
    redeemed: new BigNumber(0),
    publishedHash: '>>>>>>TEST<<<<<<< Hash',
    expDate: new BigNumber(new Date().getTime() + 7776000000),
}) {
    issueLimit() {
        return this.get('issueLimit').toNumber();
    }
    issued() {
        return this.get('issued').toNumber();
    }
    redeemed() {
        return this.get('redeemed').toNumber();
    }
    expDate() {
        return this.get('expDate').toNumber();
    }
}

export default LOCModel;