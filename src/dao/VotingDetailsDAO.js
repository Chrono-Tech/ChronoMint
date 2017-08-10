// import BigNumber from 'bignumber.js'
// import Immutable from 'immutable'
import AbstractContractDAO from './AbstractContractDAO'
import PollModel from 'models/PollModel'
// import contractsManagerDAO from './ContractsManagerDAO'
// import resultCodes from 'chronobank-smart-contracts/common/errors'

export default class VotingDetailsDAO extends AbstractContractDAO {

  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/PollDetails.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
  }

  pollsCount () {
    return this._callNum('pollsCount')
  }

  async getPoll (index) {

    const [ details, options ] = await Promise.all([
      this._call('getPoll', [index]),
      this._call('getOptionsForPoll', [index])
    ])

    console.log(details)

    return new PollModel({
      index,
      owner: details[0],
      title: this._c.bytesToString(details[1]),
      description: this._c.bytesToString(details[2]),
      // voteLimit: details[3],
      // deadline: details[4],
      // status: details[5],
      // active: details[6],
      // options: (options || []).map(() => ())
    })
  }
}
