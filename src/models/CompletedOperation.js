import {Record} from 'immutable';
import BigNumber from 'bignumber.js';

class CompletedOperation extends Record({
    operation: null,
    type: new BigNumber(0),
    needed: new BigNumber(1),
    description: null
}) {
    type() {
        return this.get('type').toNumber();
    }

    needed() {
        return this.get('needed').toNumber();
    }
}

export default CompletedOperation;