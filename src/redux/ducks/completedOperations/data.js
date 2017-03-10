import AppDAO from '../../../dao/AppDAO';
import {createCompletedOperationAction, updateCompletedOperationAction } from './reducer';
import {used} from '../../../components/common/flags';

const account = localStorage.getItem('chronoBankAccount');

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

const handleGetConfirmations = (e, r) => (dispatch) => {
    if(!e){
        for(let i=0; i< r.length; i++){
            let operation = r[i].args.operation;
            if (!dispatch(operationExists(operation))){
                dispatch(createCompletedOperationInStore(operation));
                dispatch(handleCompletedOperation(operation));
            }
        }
    }
};

const confirmationGet = () => {
    if (used(confirmationGet)) return;
    AppDAO.confirmationGet(handleGetConfirmations, {fromBlock: 0, toBlock: 'latest'});
};

export {
    handleCompletedConfirmation,
    confirmationGet
}