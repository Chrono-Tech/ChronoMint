import {List, Record} from 'immutable';
import VoteDAO from '../dao/VoteDAO';
// import PollOptionModel from './PollOptionModel';

class PollModel extends Record({
    index: null,
    pollTitle: '',
    pollDescription: '',
    options: new List( [ null, null ] )
}) {
    index() {
        return this.get('index');
    }

    pollTitle() {
        return VoteDAO.bytes32ToString(this.get('pollTitle'));
    }

    pollDescription() {
        return VoteDAO.bytes32ToString(this.get('pollDescription'));
    }

    options() {
        return this.get('options');
    }

    optionsDescriptions() {
        return this.get('options').map(option => option.description());
    }
}

export default PollModel;