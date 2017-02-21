import AppDAO from '../../../dao/AppDAO';
import {store} from '../../configureStore';
import {createCompletedOperationAction, updateCompletedOperationAction } from './reducer';

const account = localStorage.getItem('chronoBankAccount');

const operationExists = (operation)=>{
    return !!store.getState().get('completedOperations').get(operation);
};

const handleCompletedOperation = operation => {
//update only 'needed' number
    const callback = (needed)=>{
        updateCompletedOperationInStore(operation, 'needed', needed);
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

const createCompletedOperationInStore = (operation) => {
    store.dispatch(createCompletedOperationAction({operation}));
};

const updateCompletedOperationInStore = (operation, valueName, value)=>{
    store.dispatch(updateCompletedOperationAction({valueName, value, operation}));
};

const handleConfirmation = (e, r) => {
    if(!e){
        let operation = r.args.operation;
        if (!operationExists(operation)){
            createCompletedOperationInStore(operation);
        }
        handleCompletedOperation(operation);
    }
};

const handleGetConfirmations = (e, r) => {
    if(!e){
        for(let i=0; i< r.length; i++){
            let operation = r[i].args.operation;
            if (!operationExists(operation)){
                createCompletedOperationInStore(operation);
                handleCompletedOperation(operation);
            }
        }
    }
};

AppDAO.confirmationWatch(handleConfirmation);
AppDAO.confirmationGet(handleGetConfirmations, {fromBlock: 0, toBlock: 'latest'});