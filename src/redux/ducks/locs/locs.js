import {store} from '../../configureStore';
import {LocData as initialState} from './data';
import LocModel from '../../../models/LocModel'

const LOC_CREATE = 'loc/CREATE';
// const LOC_APPROVE = 'loc/APPROVE';
// const LOC_LIST = 'loc/LIST';
const LOC_EDIT = 'loc/EDIT';
const LOC_REMOVE = 'loc/REMOVE';
//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};
const createLOCAction = (data) => ({type: LOC_CREATE, data});
const removeLOCAction = (data) => ({type: LOC_REMOVE, data});
const editLOCAction = (data) => ({type: LOC_EDIT, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOC_CREATE:
            return state.set(action.data.address, new LocModel(action.data));
        case LOC_REMOVE:
            return state.delete( action.data.address );
        case LOC_EDIT:
            return state.mergeIn([action.data.address], new LocModel(action.data)._map);

        // case LOC_APPROVE:
        //     return state;
        // case LOC_LIST:
        //     return state;
        default:
            return state;
    }
};


const createLOCinStore = (address) => {
    store.dispatch(createLOCAction({address}));
};

const editLOCinStore = (valueName, value, address) => {
    store.dispatch(editLOCAction({[valueName]: value, address}));
};

const removeLOCfromStore = (address) => {
    store.dispatch(removeLOCAction({address}));
};

export {
    editLOCinStore,
    createLOCinStore,
    removeLOCfromStore,
}

export default reducer;