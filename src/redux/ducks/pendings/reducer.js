import {Map} from 'immutable';
import PendingOperation from '../../../models/PendingOperation'
import {SESSION_DESTROY} from '../session/constants';

const PENDING_CREATE = 'pending/CREATE';
const PENDING_UPDATE = 'pending/UPDATE';
const PENDING_REMOVE = 'pending/REMOVE';

const createPendingAction = (data) => ({type: PENDING_CREATE, data});
const updatePendingAction = (data) => ({type: PENDING_UPDATE, data});
const removePendingAction = (data) => ({type: PENDING_REMOVE, data});

const initialState = new Map([]);

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

export {
    createPendingAction,
    updatePendingAction,
    removePendingAction
}

export default reducer;