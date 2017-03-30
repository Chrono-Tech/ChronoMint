/* eslint new-cap: ["error", { "capIsNewExceptions": ["NewPoll", "New_Poll", "NewVote"] }] */
import AbstractContractDAO from './AbstractContractDAO'
// import TimeHolderDAO from './TimeHolderDAO';
import {bytes32} from '../utils/bytes32'

class VoteDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('../contracts/Vote.json'), at, false)
  }

  polls = (index: number, account: string) => {
    return this.contract.then(deployed => deployed.polls.call(index, {from: account}))
  };

  pollsCount = (account: string) => {
    return this.contract.then(deployed => deployed.pollsCount.call({from: account}))
  };

  newPoll = (pollTitle: string, pollDescription: string, options: Array, account: string) => {
    options = options.filter(o => o && o.length)
    let optionsCount = options.length
    let voteLimit = 150
    let deadline = 123
    pollTitle = bytes32(pollTitle)
    pollDescription = bytes32(pollDescription)
    options = options.map(item => bytes32(item))
    return this.contract.then(deployed => deployed.NewPoll(
      options, pollTitle, pollDescription, voteLimit, optionsCount, deadline, {from: account, gas: 3000000})
    )
  };

  addFilesToPoll = (pollId, files: Array, account: string) => {
    files = files.filter(f => f && f.length)
    return this.contract.then(deployed => {
      return files.map(hash => deployed.addIpfsHashToPoll(pollId, hash, {from: account, gas: 3000000}))
    })
  };

  getPollTitles = (account: string) => {
    return this.contract.then(deployed => deployed.getPollTitles.call({from: account}))
  };

  getOptionsForPoll = (index, account: string) => {
    return this.contract.then(deployed => deployed.getOptionsForPoll.call(index, {from: account}))
  };

  getIpfsHashesFromPoll = (index, account: string) => {
    return this.contract.then(deployed => deployed.getIpfsHashesFromPoll.call(index, {from: account}))
  };

  getOptionsVotesForPoll = (index, account: string) => {
    return this.contract.then(deployed => deployed.getOptionsVotesForPoll.call(index, {from: account}))
  };

  vote = (pollKey, option, account: string) => {
    return this.contract.then(deployed => {
      return deployed.vote.call(pollKey, option, {from: account})
        .then(r => {
          if (!r) return false
          deployed.vote(pollKey, option, {from: account, gas: 3000000})
          return r
        })
    })
  };

  // deposit = (amount: number, account: string) => {
  //     return this.contract.then(deployed => deployed.deposit( amount, {from: account, gas: 3000000} ));
  // };
  //
  // depositAmount = (amount: number, address: string) => {
  //     debugger;
  //     return this.contract.then(deployed =>
  //         TimeProxyDAO.approve(deployed.address, amount, address).then(() => {
  //             deployed.deposit(amount, {from: address, gas: 3000000});
  //         })
  //     );
  // };

  newPollWatch = callback => this.contract.then(deployed => {
    const blockNumber = this.web3.eth.blockNumber
    deployed.New_Poll().watch((e, r) => {
      if (r.blockNumber > blockNumber) callback(r.args._pollId.toNumber())
    })
  });

  // newVoteWatch = callback => this.contract.then(deployed => deployed.NewVote().watch(callback));

  newVoteWatch = callback => this.contract.then(deployed => {
    const blockNumber = this.web3.eth.blockNumber
    deployed.NewVote().watch((e, r) => {
      if (r.blockNumber > blockNumber) callback(r.args._pollId.toNumber(), r.args._choice.toNumber())
    })
  });
}

export default new VoteDAO()
