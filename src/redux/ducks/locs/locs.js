import {store} from '../../configureStore';
import initialState from './data';
import LocModel from '../../../models/LocModel'

const LOC_CREATE = 'loc/CREATE';
const LOC_UPDATE = 'loc/UPDATE';
const LOC_REMOVE = 'loc/REMOVE';
//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};
const createLOCAction = (data) => ({type: LOC_CREATE, data});
const removeLOCAction = (data) => ({type: LOC_REMOVE, data});
const updateLOCAction = (data) => ({type: LOC_UPDATE, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOC_CREATE:
            return state.set(action.data.address, new LocModel(action.data));
        case LOC_REMOVE:
            return state.delete(action.data.address);
        case LOC_UPDATE:
            return state.setIn([action.data.address, action.data.valueName], action.data.value);
        default:
            return state;
    }
};


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
    updateLOCinStore,
    createLOCtoStore,
    removeLOCfromStore,
}

export default reducer;