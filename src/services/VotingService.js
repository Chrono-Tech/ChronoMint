import contractsManagerDAO from 'dao/ContractsManagerDAO'
import PollBackendDAO, { EVENT_POLL_ACTIVATED, EVENT_POLL_ENDED, EVENT_POLL_VOTED } from 'dao/PollBackendDAO'
import EventEmitter from 'events'
import { EVENT_POLL_CREATED, EVENT_POLL_REMOVED } from 'dao/VotingManagerDAO'

class VotingService extends EventEmitter {

  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getPollBackendDAO (address) {
    if (!this._cache[ address ]) {
      this._cache[ address ] = new PollBackendDAO(address)
    }
    return this._cache[ address ]
  }

  async getVotingManager () {
    if (!this._cache[ 'VotingManager' ]) {
      this._cache[ 'VotingManager' ] = await contractsManagerDAO.getVotingManagerDAO()
    }
    return this._cache[ 'VotingManager' ]
  }

  subscribeToPoll (address) {
    if (this._cache[ address ]) return null
    const dao = this.getPollBackendDAO(address)

    return Promise.all([
      dao.watchVoted((result) => {
        this.emit(EVENT_POLL_VOTED, result)
      }, {
        self: address,
      }),
      dao.watchActivated((result) => {
        this.emit(EVENT_POLL_ACTIVATED, result)
      }, {
        self: address,
      }),
      dao.watchEnded((result) => {
        this.emit(EVENT_POLL_ENDED, result)
      }, {
        self: address,
      }),
    ])
  }

  async subscribeToVoting () {
    const dao = await this.getVotingManager()

    return Promise.all([
      dao.watchCreated((result) => {
        this.emit(EVENT_POLL_CREATED, result)
      }),
      dao.watchRemoved((result) => {
        this.emit(EVENT_POLL_REMOVED, result)
      }),
    ])
  }

}

export default new VotingService()
