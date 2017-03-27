import PendingManagerDAO from '../../../dao/PendingManagerDAO';
import {createCompletedOperationAction, updateCompletedOperationAction } from './reducer';
import {CONFIRMATIONS_LOAD_START, CONFIRMATIONS_LOAD_SUCCESS} from './communication';

const account = localStorage.getItem('chronoBankAccount');

const confirmationsLoadStartAction = () => ({type: CONFIRMATIONS_LOAD_START});
const confirmationsLoadSuccessAction = (payload) => ({type: CONFIRMATIONS_LOAD_SUCCESS, payload});

const operationExists = (operation) => (dispatch, getState) => {
    return !!getState().get('completedOperations').get(operation);
};

const handleCompletedOperation = operation => (dispatch) => {
    const callback = (value)=>{
        dispatch(updateCompletedOperationAction({valueName: 'needed', value, operation}));
    };

    PendingManagerDAO.pendingYetNeeded(operation, account).then(needed => callback(needed) );
};

// const updateCompletedOperation = (operation)=>{
//     const callback = (valueName, value) => {
//         updateCompletedOperationInStore(operation, valueName, value);
//     };
//
//     ChronoMintDAO.getTxsData(operation, account).then( data => callback('data', data) );
//     ChronoMintDAO.getTxsType(operation, account).then( type => callback('type', type) );
// };

const handleCompletedConfirmation = (operation) => (dispatch) => {
    if (!dispatch(operationExists(operation))){
        dispatch(createCompletedOperationAction({operation}));
    }
    dispatch(handleCompletedOperation(operation));
};

const handleGetConfirmations = (r) => (dispatch) => {
    for(let i=0; i< r.length; i++){
        let operation = r[i].args.operation;
        if (!dispatch(operationExists(operation))){
            dispatch(createCompletedOperationAction({operation}));
            dispatch(handleCompletedOperation(operation));
        }
    }
    dispatch(confirmationsLoadSuccessAction());
};

const getConfirmations = () => (dispatch) => {
    dispatch(confirmationsLoadStartAction());
    PendingManagerDAO.confirmationGet((e, r) => dispatch(handleGetConfirmations(r)), {fromBlock: 0, toBlock: 'latest'});
};

export {
    handleCompletedConfirmation,
    getConfirmations
}