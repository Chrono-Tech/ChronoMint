import {store} from '../../configureStore';
import PendingOperation from '../../../models/PendingOperation'
import initialState from './data';

const PENDING_ADD = 'pending/ADD';
const PENDING_UPDATE = 'pending/UPDATE';
const PENDING_UPDATE_PROPS = 'pending/UPDATE_PROPS';

const addPendingAction = (data) => ({type: PENDING_ADD, data});
const updatePendingAction = (data) => ({type: PENDING_UPDATE, data});
const updatePropsAction = (data) => ({type: PENDING_UPDATE_PROPS, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PENDING_ADD:
            return state.setIn(['items', action.data.operation], new PendingOperation(action.data));
        case PENDING_UPDATE:
            return state.setIn(['items', action.data.operation, action.data.valueName], action.data.value);
        case PENDING_UPDATE_PROPS:
            return state.setIn(['props', action.data.valueName], action.data.value);
        default:
            return state;
    }
};


const addPendingToStore = (operation)=>{
    store.dispatch(addPendingAction({operation}));
};

const updatePendingInStore = (valueName, value, operation)=>{
    store.dispatch(updatePendingAction({valueName, value, operation}));
};

const updatePropsInStore = (valueName, value)=> {
    store.dispatch(updatePropsAction({valueName, value}));
};

export {
    updatePropsInStore,
    addPendingToStore,
    updatePendingInStore
}

export default reducer;