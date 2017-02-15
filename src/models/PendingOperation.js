import {Record} from 'immutable';
import BigNumber from 'bignumber.js';

class PendingOperation extends Record({
    operation: null,
    type: new BigNumber(0),
    needed: new BigNumber(0),
    description: null,
    hasConfirmed: null,
}) {
    type() {
        return this.get('type').toNumber();
    }

    needed() {
        return this.get('needed').toNumber();
    }
}

export default PendingOperation;