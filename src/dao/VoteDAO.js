/* eslint new-cap: ["error", { "capIsNewExceptions": ["NewPoll", "New_Poll", "NewVote"] }] */
import AbstractContractDAO from './AbstractContractDAO'
import PollModel from '../models/PollModel'
import PollOptionModel from '../models/PollOptionModel'
// import TIMEHolderDAO from './TIMEHolderDAO';

class VoteDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('../contracts/Vote.json'), at)
  }

  polls = (index: number, account: string) => {
    return this.contract.then(deployed => deployed.polls.call(index, {from: account}))
  };

  pollsCount = (account: string) => {
    return this.contract.then(deployed => deployed.pollsCount.call({from: account}))
  };

  newPoll = (pollTitle: string, pollDescription: string, voteLimit: number, deadline: number, options: Array, account: string) => {
    options = options.filter(o => o && o.length)
    let optionsCount = options.length
    pollTitle = this._toBytes32(pollTitle)
    pollDescription = this._toBytes32(pollDescription)
    options = options.map(item => this._toBytes32(item))
    return this.contract.then(deployed => deployed.NewPoll(
      options, pollTitle, pollDescription, voteLimit, optionsCount, deadline, {from: account, gas: 3000000})
    )
  };

  activatePoll = (pollId, account: string) => {
    return this.contract.then(deployed => deployed.activatePoll(
      pollId, {from: account, gas: 3000000})
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

  getPoll = (index, account: string) => {
    const callback = (poll, deployed) => {
      const promise0 = deployed.getOptionsVotesForPoll(index, {from: account})
      const promise1 = deployed.getOptionsForPoll(index, {from: account})
      const promise2 = deployed.getIpfsHashesFromPoll(index, {from: account})
      return Promise.all([promise0, promise1, promise2]).then((r) => {
        poll.options = r[0].map((votes, index) => new PollOptionModel({
          index,
          votes: votes.toNumber(),
          description: this._bytesToString(r[1][index])
        }))
        poll.files = r[2].map((hash, index) => ({index, hash}))

        // const owner = poll[0];
        const pollTitle = this._bytesToString(poll[1])
        const pollDescription = this._bytesToString(poll[2])
        const voteLimit = poll[3].toNumber()
        // const optionsCount = poll[4]
        const deadline = poll[5].toNumber()
        const ongoing = poll[6]
        // const ipfsHashesCount = poll[7]
        const activated = poll[8]
        const options = poll.options
        const files = poll.files
        return new PollModel({index, pollTitle, pollDescription, voteLimit, deadline, options, files, activated, ongoing})
      })
    }

    return this.contract.then(deployed => deployed.polls.call(index, {from: account}).then((r) => callback(r, deployed)))
  };

  vote = (pollKey, option, account: string) => {
    return this.contract.then(deployed => {
      return deployed.vote.call(pollKey, option, {from: account})
      .then(r => {
        if (!r) return false
        return deployed.vote(pollKey, option, {from: account, gas: 3000000})
      })
    })
  };

  newPollWatch = callback => this.contract.then(deployed => {
    let blockNumber = null
    this.web3.eth.getBlockNumber((e, r) => {
      blockNumber = r
      deployed.New_Poll().watch((e, r) => {
        if (r.blockNumber > blockNumber) callback(r.args._pollId.toNumber())
      })
    })
  });

  newVoteWatch = callback => this.contract.then(deployed => {
    let blockNumber = null
    this.web3.eth.getBlockNumber((e, r) => {
      blockNumber = r
      deployed.NewVote().watch((e, r) => {
        if (r.blockNumber > blockNumber) callback(r.args._pollId.toNumber(), r.args._choice.toNumber())
      })
    })
  });
}

export default new VoteDAO()
