import {Record as record} from 'immutable';

class OperationsProps extends record({
    signaturesRequired: 0,
}) {
    signaturesRequired() {
        return this.get('signaturesRequired');
    }
}

export default OperationsProps;