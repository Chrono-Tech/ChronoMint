import contractsManagerDAO from 'dao/ContractsManagerDAO'
import PollNoticeModel, { IS_VOTED, IS_ACTIVATED, IS_ENDED } from 'models/notices/PollNoticeModel'
import { MultiEventsHistoryABI, PollEmitterABI } from './abi'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'

export const EVENT_POLL_VOTED = 'PollVoted'
export const EVENT_POLL_ACTIVATED = 'PollActivated'
export const EVENT_POLL_ENDED = 'PollEnded'

export default class PollEmitterDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(PollEmitterABI, at, MultiEventsHistoryABI)
  }

  /** @private */
  _watchCallback = (callback, status, account: string) => async (result) => {

    const dao = await contractsManagerDAO.getVotingManagerDAO()
    const poll = await dao.getPoll(result.args.self, account)

    callback(new PollNoticeModel({
      pollId: result.args.self, // just a long
      poll,
      status,
      transactionHash: result.transactionHash,
    }))
  }

  async watchVoted (callback, filter, account) {
    return this._watch(EVENT_POLL_VOTED, this._watchCallback(callback, IS_VOTED, account), filter)
  }

  async watchActivated (callback, filter) {
    return this._watch(EVENT_POLL_ACTIVATED, this._watchCallback(callback, IS_ACTIVATED), filter)
  }

  async watchEnded (callback, filter) {
    return this._watch(EVENT_POLL_ENDED, this._watchCallback(callback, IS_ENDED), filter)
  }
}
