import {store} from '../../configureStore';

//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};
import { createLOCAction, updateLOCAction, removeLOCAction} from './reducer';

const createLOCtoStore = (address) => {
    store.dispatch(createLOCAction({address}));
};

const updateLOCinStore = (valueName, value, address) => {
    store.dispatch(updateLOCAction({valueName, value, address}));
};

const removeLOCfromStore = (address) => {
    store.dispatch(removeLOCAction({address}));
};

export {
    createLOCtoStore,
    updateLOCinStore,
    removeLOCfromStore,
}