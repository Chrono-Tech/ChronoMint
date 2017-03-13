import BigNumber from 'bignumber.js';
import {Record} from 'immutable';
import {hex2ascii} from '../utils/bytes32';

class PollOptionModel extends Record({
    index: null,
    description: '',
    votes: new BigNumber(0)
}) {
    index() {
        return this.get('index');
    }

    description() {
        return hex2ascii(this.get('description'));
    }

    votes() {
        return this.get('votes').toNumber();
    }
}

export default PollOptionModel;