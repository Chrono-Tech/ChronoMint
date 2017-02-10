import {Record} from 'immutable';

class LocModel extends Record({
    isFetching: false,
    error: null,
    locName: null,
    issueLimit: null,
    expDate: null,
    hasConfirmed: null,
    website: null,
    publishedHash: null
}) {}

export default LocModel;
