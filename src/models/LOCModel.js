import {Record as record} from 'immutable';
import BigNumber from 'bignumber.js';

//  TODO CHANGE DEFAULT REMOVE TEST
class LOCModel extends record({
    hasConfirmed: null,
    address: null,
    locName: 'Default LOC name',
    issueLimit: new BigNumber(1000),
    expDate: new BigNumber(new Date().getTime() + 7776000000),
    website: 'http://www.default.com',
    publishedHash: '>>>>>>TEST<<<<<<< Hash'
}) {
    issueLimit() {
        return this.get('issueLimit').toNumber();
    }
    expDate() {
        return this.get('expDate').toNumber();
    }
}

export default LOCModel;