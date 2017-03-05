import {store} from '../../configureStore';

import { createPollAction, updatePollAction, removePollAction} from './reducer';

const createPollInStore = (pollTitle) => {
    store.dispatch(createPollAction({pollTitle}));
    return (store.getState().get('polls').get(pollTitle));
};

const updatePollInStore = (valueName, value, address) => {
    store.dispatch(updatePollAction({valueName, value, address}));
};
//
// const removePollfromStore = (address) => {
//     store.dispatch(removePollAction({address}));
// };

export {
    createPollInStore,
    updatePollInStore,
    // removePollfromStore,
}