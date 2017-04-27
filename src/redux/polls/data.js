import VoteDAO from '../../dao/VoteDAO'
import { showAlertModal, hideModal } from '../ui/modal'
import PollModel from '../../models/PollModel'
import { POLLS_LOAD_START, POLLS_LOAD_SUCCESS } from './communication'
import { POLL_CREATE, POLL_UPDATE } from './reducer'
import LS from '../../dao/LocalStorageDAO'

const updatePoll = (data) => ({type: POLL_UPDATE, data})

const newPoll = (props) => dispatch => {
  let {pollTitle, pollDescription, options, files, voteLimit, deadline, account} = props
  VoteDAO.newPoll(pollTitle, pollDescription, voteLimit, deadline, options, account).then(r => {
    const pollId = r.logs[0].args._pollId
    if (pollId) {
      VoteDAO.addFilesToPoll(pollId.toNumber(), files, account)
    }
    dispatch(showAlertModal({title: 'New Poll', message: 'Request sent successfully'}))
  }).catch(() => {
    dispatch(showAlertModal({title: 'New Poll Error!', message: 'Transaction canceled!'}))
  })
}

const votePoll = (props) => dispatch => {
  let {pollKey, optionIndex, account} = props
  dispatch(updatePoll({valueName: 'isTransaction', value: true, index: pollKey}))
  return VoteDAO.vote(pollKey, optionIndex + 1, account).then(r => {
    if (r) {
      dispatch(hideModal())
    } else {
      dispatch(showAlertModal({title: 'Error', message: 'You already voted'}))
    }
    dispatch(updatePoll({valueName: 'isTransaction', value: false, index: pollKey}))
  }).catch(() => {
    dispatch(updatePoll({valueName: 'isTransaction', value: false, index: pollKey}))
    dispatch(showAlertModal({title: 'Vote Error', message: 'Transaction canceled!'}))
  })
}

const createPoll = (index, account) => (dispatch) => {
  dispatch({
    type: POLL_CREATE,
    data: {index, poll: new PollModel({index, isFetching: true, options: []})}
  })

  VoteDAO.getPoll(index, account).then((poll) => {
    dispatch({
      type: POLL_CREATE,
      data: {index, poll}
    })
  })
}

const activatePoll = (index, account) => dispatch => {
  dispatch(updatePoll({valueName: 'isTransaction', value: true, index}))
  VoteDAO.activatePoll(index, account).then(() => {
    // dispatch(showAlertModal({title: 'Done', message: 'Poll activated'}))
    dispatch(createPoll(index, account))
    dispatch(updatePoll({valueName: 'isTransaction', value: false, index}))
  }).catch(() => {
    dispatch(updatePoll({valueName: 'isTransaction', value: false, index}))
    dispatch(showAlertModal({title: 'Activate Poll Error', message: 'Transaction canceled!'}))
  })
}

const closePoll = (index, account) => dispatch => {
  dispatch(updatePoll({valueName: 'isTransaction', value: true, index}))
  VoteDAO.adminEndPoll(index, account).then(() => {
    dispatch(createPoll(index, account))
    dispatch(updatePoll({valueName: 'isTransaction', value: false, index}))
  }).catch(() => {
    dispatch(updatePoll({valueName: 'isTransaction', value: false, index}))
    dispatch(showAlertModal({title: 'Close Poll Error', message: 'Transaction canceled!'}))
  })
}

const getPolls = (account) => (dispatch) => {
  dispatch({type: POLLS_LOAD_START})
  const promises = []
  VoteDAO.pollsCount(account).then(count => {
    for (let i = 0; i < count.toNumber(); i++) {
      let promise = dispatch(createPoll(i, account))
      promises.push(promise)
    }
    dispatch({type: POLLS_LOAD_SUCCESS})
    Promise.all(promises)
  })
}

const handleNewPoll = (index) => (dispatch) => {
  dispatch(createPoll(index, LS.getAccount()))// .then(loc => {dispatch(notify(new LOCNoticeModel({loc})))});
}

const handleNewVote = (pollIndex, voteIndex) => (dispatch) => {
  dispatch(createPoll(pollIndex, LS.getAccount()))// .then(loc => {dispatch(notify(new LOCNoticeModel({loc})))});
}

export {
  newPoll,
  activatePoll,
  closePoll,
  votePoll,
  getPolls,
  handleNewPoll,
  handleNewVote
}
