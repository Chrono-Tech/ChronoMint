import {store} from '../../configureStore';
import PendingOperation from '../../../models/PendingOperation'
import initialState from './data';

const PENDING_CREATE = 'pending/CREATE';
const PENDING_UPDATE = 'pending/UPDATE';
const PENDING_REMOVE = 'pending/REMOVE';
const PENDING_UPDATE_PROPS = 'pending/UPDATE_PROPS';

const createPendingAction = (data) => ({type: PENDING_CREATE, data});
const updatePendingAction = (data) => ({type: PENDING_UPDATE, data});
const removePendingAction = (data) => ({type: PENDING_REMOVE, data});
const updatePropsAction = (data) => ({type: PENDING_UPDATE_PROPS, data});
//  todo: remove props
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PENDING_CREATE:
            return state.setIn(['items', action.data.operation], new PendingOperation(action.data));
        case PENDING_UPDATE:
            return state.setIn(['items', action.data.operation, action.data.valueName], action.data.value);
        case PENDING_REMOVE:
            return state.removeIn(['items', action.data.operation]);

            return state.setIn(['items', action.data.operation, action.data.valueName], action.data.value);
        case PENDING_UPDATE_PROPS:
            return state.setIn(['props', action.data.valueName], action.data.value);
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

const updatePropsInStore = (valueName, value)=> {
    store.dispatch(updatePropsAction({valueName, value}));
};

export {
    updatePropsInStore,
    addPendingToStore,
    updatePendingPropInStore,
    removePendingFromStore
}

export default reducer;