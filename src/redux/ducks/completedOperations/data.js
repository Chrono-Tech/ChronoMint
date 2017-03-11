import AppDAO from '../../../dao/AppDAO';
import {createCompletedOperationAction, updateCompletedOperationAction } from './reducer';
import {CONFIRMATIONS_LOAD_START, CONFIRMATIONS_LOAD_SUCCESS} from './communication';

const account = localStorage.getItem('chronoBankAccount');

const confirmationsLoadStartAction = () => ({type: CONFIRMATIONS_LOAD_START});
const confirmationsLoadSuccessAction = (payload) => ({type: CONFIRMATIONS_LOAD_SUCCESS, payload});

const operationExists = (operation) => (dispatch, getState) => {
    return !!getState().get('completedOperations').get(operation);
};

const updateCompletedOperationInStore = (operation, valueName, value) => (dispatch) => {
    dispatch(updateCompletedOperationAction({valueName, value, operation}));
};

const handleCompletedOperation = operation => (dispatch) => {
//update only 'needed' number
    const callback = (needed)=>{
        dispatch(updateCompletedOperationInStore(operation, 'needed', needed));
        // if (needed.toNumber()){
        //     return;
        // }
        // updateCompletedOperation(operation);
    };

    AppDAO.pendingYetNeeded(operation, account).then( needed => callback(needed) );
};

// const updateCompletedOperation = (operation)=>{
//     const callback = (valueName, value) => {
//         updateCompletedOperationInStore(operation, valueName, value);
//     };
//
//     AppDAO.getTxsData(operation, account).then( data => callback('data', data) );
//     AppDAO.getTxsType(operation, account).then( type => callback('type', type) );
// };

const createCompletedOperationInStore = (operation) => (dispatch) => {
    dispatch(createCompletedOperationAction({operation}));
};

const handleCompletedConfirmation = (operation) => (dispatch) => {
    if (!dispatch(operationExists(operation))){
        dispatch(createCompletedOperationInStore(operation));
    }
    dispatch(handleCompletedOperation(operation));
};

const handleGetConfirmations = (r) => (dispatch) => {
    for(let i=0; i< r.length; i++){
        let operation = r[i].args.operation;
        if (!dispatch(operationExists(operation))){
            dispatch(createCompletedOperationInStore(operation));
            dispatch(handleCompletedOperation(operation));
        }
    }
    dispatch(confirmationsLoadSuccessAction());
};

const getConfirmationsOnce = () => (dispatch, getState) => {
    if (!getState().get('completedCommunication').isNeedReload) return;
    dispatch(confirmationsLoadStartAction());
    AppDAO.confirmationGet((e, r) => dispatch(handleGetConfirmations(r)), {fromBlock: 0, toBlock: 'latest'});
};

export {
    handleCompletedConfirmation,
    getConfirmationsOnce
}