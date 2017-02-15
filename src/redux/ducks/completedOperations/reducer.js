import {store} from '../../configureStore';
import initialState from './data';
import CompletedOperation from '../../../models/CompletedOperation'

const COMPLETE_OPERATION_CREATE = 'completeOperation/CREATE';
const COMPLETE_OPERATION_UPDATE = 'completeOperation/UPDATE';

const createCompletedOperationAction = (data) => ({type: COMPLETE_OPERATION_CREATE, data});
const updateCompletedOperationAction = (data) => ({type: COMPLETE_OPERATION_UPDATE, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case COMPLETE_OPERATION_CREATE:
            return state.set(action.data.operation, new CompletedOperation(action.data));
        case COMPLETE_OPERATION_UPDATE:
            return state.setIn([action.data.operation, action.data.valueName], action.data.value);
        default:
            return state;
    }
};

const createCompletedOperationInStore = (operation) => {
    store.dispatch(createCompletedOperationAction({operation}));
};

const updateCompletedOperationInStore = (operation, valueName, value)=>{
    store.dispatch(updateCompletedOperationAction({valueName, value, operation}));
};

export {
    updateCompletedOperationInStore,
    createCompletedOperationInStore,
}

export default reducer;