import {Record} from 'immutable';

class PollModel extends Record({
    // address: null,
    pollTitle: null,
    pollDescription: null,
    options: [null, null]
}) {
    address() {
        return this.get('address')
    }
    pollTitle() {
        return this.get('pollTitle')
    }
    pollDescription() {
        return this.get('pollDescription')
    }
    options() {
        return this.get('options')
    }
}

export default PollModel;