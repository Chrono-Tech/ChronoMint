import {Record} from 'immutable';

class TokenModel extends Record({
    address: null,
    name: null
}) {
    name() {
        return this.get('name');
    };

    address() {
        return this.get('address');
    };
}

export default TokenModel;