import {Record} from 'immutable';
import BigNumber from 'bignumber.js';

class OperationsProps extends Record({
    signaturesRequired: new BigNumber(0),
}) {
    signaturesRequired() {
        return this.get('signaturesRequired').toNumber();
    }
}

export default OperationsProps;