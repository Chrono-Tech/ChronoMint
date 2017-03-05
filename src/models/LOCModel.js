import {Record as record} from 'immutable';
import BigNumber from 'bignumber.js';

class LOCModel extends record({
    address: null,
    hasConfirmed: null,
    locName: null,
    website: null,
    controller: null,
    issueLimit: new BigNumber(0),
    issued: new BigNumber(0),
    redeemed: new BigNumber(0),
    publishedHash: null,
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