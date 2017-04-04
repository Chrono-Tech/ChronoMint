import {createPollAction} from './reducer' /*, updatePollAction, removePollAction */

const createPollInStore = (poll, index) => (dispatch, getState) => {
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
  return (getState().get('polls').get(index))
}

// const updatePollInStore = (poll, index) => (dispatch) => {
//     dispatch(updatePollAction({valueName, value, address}));
// };
//
// const removePollfromStore = (address) => (dispatch) => {
//     dispatch(removePollAction({address}));
// };

export {
  createPollInStore
  // updatePollInStore,
  // removePollfromStore,
}
