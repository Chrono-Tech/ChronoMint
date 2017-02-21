import {Record as record} from 'immutable';
import BigNumber from 'bignumber.js';

class OperationsProps extends record({
    signaturesRequired: new BigNumber(0),
}) {
    signaturesRequired() {
        return this.get('signaturesRequired').toNumber();
    }
}

export default OperationsProps;