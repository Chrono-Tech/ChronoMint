import BigNumber from 'bignumber.js';
import {Record} from 'immutable';
import VoteDAO from '../dao/VoteDAO';

class PollOptionModel extends Record({
    index: null,
    description: '',
    votes: new BigNumber(0)
}) {
    index() {
        return this.get('index');
    }

    description() {
        return VoteDAO.bytes32ToString(this.get('description'));
    }

    votes() {
        return this.get('votes').toNumber();
    }
}

export default PollOptionModel;