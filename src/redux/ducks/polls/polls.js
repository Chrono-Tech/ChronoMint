import {store} from '../../configureStore';

import { createPollAction, /*updatePollAction, removePollAction*/} from './reducer';

const createPollInStore = (poll, index) => {
    // const owner = poll[0];
    const pollTitle = poll[1];
    const pollDescription = poll[2];
    // const voteLimit = poll[3];
    // const optionsCount = poll[4];
    // const deadline = poll[5];
    // const status = poll[6];
    // const ipfsHashesCount = poll[7];
    const options = poll.options;
    const pollData = {index, pollTitle, pollDescription, options};
    store.dispatch(createPollAction(pollData));
    return (store.getState().get('polls').get(index));
};

// const updatePollInStore = (poll, index) => {
//     store.dispatch(updatePollAction({valueName, value, address}));
// };
//
// const removePollfromStore = (address) => {
//     store.dispatch(removePollAction({address}));
// };

export {
    createPollInStore,
    // updatePollInStore,
    // removePollfromStore,
}