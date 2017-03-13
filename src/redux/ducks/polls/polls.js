import { createPollAction, /*updatePollAction, removePollAction*/} from './reducer';

const createPollInStore = (poll, index) => (dispatch, getState) => {
    // const owner = poll[0];
    const pollTitle = poll[1];
    const pollDescription = poll[2];
    // const voteLimit = poll[3];
    // const optionsCount = poll[4];
    // const deadline = poll[5];
    // const status = poll[6];
    // const ipfsHashesCount = poll[7];
    const options = poll.options;
    const files = poll.files;
    const pollData = {index, pollTitle, pollDescription, options, files};
    dispatch(createPollAction(pollData));
    return (getState().get('polls').get(index));
};

// const updatePollInStore = (poll, index) => (dispatch) => {
//     dispatch(updatePollAction({valueName, value, address}));
// };
//
// const removePollfromStore = (address) => (dispatch) => {
//     dispatch(removePollAction({address}));
// };

export {
    createPollInStore,
    // updatePollInStore,
    // removePollfromStore,
}