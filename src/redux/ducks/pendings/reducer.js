import {store} from '../../configureStore';
import PendingOperation from '../../../models/PendingOperation'
import initialState from './data';
import {SESSION_DESTROY} from '../session/data';

const PENDING_CREATE = 'pending/CREATE';
const PENDING_UPDATE = 'pending/UPDATE';
const PENDING_REMOVE = 'pending/REMOVE';

const createPendingAction = (data) => ({type: PENDING_CREATE, data});
const updatePendingAction = (data) => ({type: PENDING_UPDATE, data});
const removePendingAction = (data) => ({type: PENDING_REMOVE, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SESSION_DESTROY:
            return initialState;
        case PENDING_CREATE:
            return state.set(action.data.operation, new PendingOperation(action.data));
        case PENDING_UPDATE:
            return state.setIn([action.data.operation, action.data.valueName], action.data.value);
        case PENDING_REMOVE:
            return state.remove(action.data.operation);
        default:
            return state;
    }
};

const addPendingToStore = (operation)=>{
    store.dispatch(createPendingAction({operation}));
};

const updatePendingPropInStore = (operation, valueName, value)=>{
    store.dispatch(updatePendingAction({valueName, value, operation}));
};

const removePendingFromStore = (operation)=> {
    store.dispatch(removePendingAction({operation}));
};

export {
    addPendingToStore,
    updatePendingPropInStore,
    removePendingFromStore
}

export default reducer;