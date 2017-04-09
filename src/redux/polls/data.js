/* eslint new-cap: ["error", { "capIsNewExceptions": ["NewPoll"] }] */
import VoteDAO from '../../dao/VoteDAO'
import {showAlertModal, hideModal} from '../ui/modal'
import PollOptionModel from '../../models/PollOptionModel'
import {POLLS_LOAD_START, POLLS_LOAD_SUCCESS} from './communication'
import {POLL_CREATE, POLL_UPDATE} from './reducer'

const pollsLoadStartAction = () => ({type: POLLS_LOAD_START})
const pollsLoadSuccessAction = (payload) => ({type: POLLS_LOAD_SUCCESS, payload})
const createPollAction = (data) => ({type: POLL_CREATE, data})
const updatePollAction = (data) => ({type: POLL_UPDATE, data})

const newPoll = (props) => {
  let {pollTitle, pollDescription, options, files, voteLimit, deadline, account} = props
  VoteDAO.newPoll(pollTitle, pollDescription, voteLimit, deadline, options, account)
    .then(r => {
      const pollId = r.logs[0].args._pollId
      if (pollId) {
        VoteDAO.addFilesToPoll(pollId.toNumber(), files, account)
      }
    })
    .catch(error => console.error(error))
}

const votePoll = (props) => dispatch => {
  let {pollKey, optionIndex, account} = props
  dispatch(updatePollAction({valueName: 'isVoting', value: true, index: pollKey}))
  return VoteDAO.vote(pollKey, optionIndex + 1, account)
    .then(r => {
      if (r) {
        dispatch(updatePollAction({valueName: 'isVoting', value: false, index: pollKey}))
        dispatch(hideModal())
      } else {
        dispatch(updatePollAction({valueName: 'isVoting', value: false, index: pollKey}))
        dispatch(showAlertModal({title: 'Error', message: 'You already voted'}))
      }
    })
}

const loadPoll = (index, account) => (dispatch) => {
  dispatch(createPollAction({index, isFetching: true, options: []}))
  const callback = (poll) => {
    const promise0 = VoteDAO.getOptionsVotesForPoll(index, account)
    const promise1 = VoteDAO.getOptionsForPoll(index, account)
    const promise2 = VoteDAO.getIpfsHashesFromPoll(index, account)
    return Promise.all([promise0, promise1, promise2]).then((r) => {
      poll.options = r[0].map((votes, index) => new PollOptionModel({
        index,
        votes: votes.toNumber(),
        description: r[1][index]
      }))// todo move to DAO
      poll.files = r[2].map((hash, index) => ({index, hash}))

      // const owner = poll[0];
      const pollTitle = poll[1]
      const pollDescription = poll[2]
      const voteLimit = poll[3].toNumber()
      // const optionsCount = poll[4]
      const deadline = poll[5].toNumber()
      const ongoing = poll[6]
      // const ipfsHashesCount = poll[7]
      const activated = poll[8]
      const options = poll.options
      const files = poll.files
      dispatch(createPollAction({index, pollTitle, pollDescription, voteLimit, deadline, options, files, activated, ongoing}))
      // return (getState().get('polls').get(index))//  todo: return pollModel for notice
    })
  }

  return VoteDAO.polls(index, account).then(callback)
}

const activatePoll = (index, account) => dispatch => {
  dispatch(updatePollAction({valueName: 'isActivating', value: true, index}))
  VoteDAO.activatePoll(index, account)
    .then(() => {
      // dispatch(showAlertModal({title: 'Done', message: 'Poll activated'}))
      dispatch(loadPoll(index, account))
      dispatch(updatePollAction({valueName: 'isActivating', value: false, index}))
    })
    .catch(error => console.error(error))
}

const getPolls = (account) => (dispatch) => {
  dispatch(pollsLoadStartAction())
  const promises = []
  VoteDAO.pollsCount(account).then(count => {
    for (let i = 0; i < count.toNumber(); i++) {
      let promise = dispatch(loadPoll(i, account))
      promises.push(promise)
    }
    dispatch(pollsLoadSuccessAction())  //  todo Change to pollsCountSuccessAction
    Promise.all(promises)// .then(() => dispatch(pollsLoadSuccessAction()))
  })
}

const handleNewPoll = (index) => (dispatch) => {
  dispatch(loadPoll(index, window.localStorage.chronoBankAccount))// .then(loc => {dispatch(notify(new LOCNoticeModel({loc})))});
}

const handleNewVote = (pollIndex, voteIndex) => (dispatch) => {
  dispatch(loadPoll(pollIndex, window.localStorage.chronoBankAccount))// .then(loc => {dispatch(notify(new LOCNoticeModel({loc})))});
}

export {
  newPoll,
  activatePoll,
  votePoll,
  getPolls,
  handleNewPoll,
  handleNewVote
}
