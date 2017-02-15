import {Record} from 'immutable';

class TokenModel extends Record({
    address: null,
    name: null,
    symbol: null,
    totalSupply: null
}) {
    name() {
        return this.get('name');
    };

    address() {
        return this.get('address');
    };

    symbol() {
        return this.get('symbol');
    };

    totalSupply() {
        return this.get('totalSupply');
    };
}

export default TokenModel;