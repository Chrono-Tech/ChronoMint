import { createLOCAction, updateLOCAction, removeLOCAction} from './reducer';

//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};

const createLOCinStore = (address) => (dispatch, getState) => {
    dispatch(createLOCAction({address}));
    return (getState().get('locs').get(address));
};

const updateLOCinStore = (valueName, value, address) => (dispatch) => {
    dispatch(updateLOCAction({valueName, value, address}));
};

const removeLOCfromStore = (address) => (dispatch) => {
    dispatch(removeLOCAction({address}));
};

export {
    createLOCinStore,
    updateLOCinStore,
    removeLOCfromStore,
}