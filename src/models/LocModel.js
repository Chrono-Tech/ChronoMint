import {Record} from 'immutable';
import BigNumber from 'bignumber.js';

class LocModel extends Record({
    isFetching: false,
    hasConfirmed: null,
    error: null,
    address: null,
    locName: 'Default name',
    issueLimit: new BigNumber(100500),
    expDate: new BigNumber(new Date().getTime() + 7776000000),
    website: 'http://www.default.com',
    publishedHash: 'defaultHash'
}) {}

export default LocModel;