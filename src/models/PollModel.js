import {Record} from 'immutable';
import VoteDAO from '../dao/VoteDAO';


class PollModel extends Record({
    // address: null,
    pollTitle: null,
    pollDescription: null,
    options: [null, null]
}) {
    // address() {
    //     return this.get('address')
    // }
    pollTitle() {
        return VoteDAO.bytes32ToString(this.get('pollTitle'));
    }

    pollDescription() {
        return this.get('pollDescription')
    }

    options() {
        return this.get('options')
    }
}

export default PollModel;