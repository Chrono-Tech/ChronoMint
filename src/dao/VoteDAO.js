import AbstractContractDAO from './AbstractContractDAO';
import bytes32 from '../utils/bytes32';

class VoteDAO extends AbstractContractDAO {
    constructor(at) {
        super(require('../contracts/Vote.json'), at, false);
    }

    NewPoll = (pollTitle: string, options: array, account: string) => {
        let count = options.length;
        let voteLimit = 150;
        let deadline = 123;
        debugger;
        pollTitle = bytes32(pollTitle);
        options = options.map(item => (bytes32(item)));
        return this.contract.then(deployed => deployed.NewPoll(
            options, pollTitle, voteLimit, count, deadline, {from: account, gas: 3000000})
        );
    };
}

export default new VoteDAO();