import AppDAO from '../../../dao/AppDAO';
import {Map} from 'immutable';
import {createCompletedOperationInStore, updateCompletedOperationInStore} from './reducer';
import {store} from '../../configureStore';

const account = localStorage.getItem('chronoBankAccount');

const initialState = new Map([]);

const operationExists = (operation)=>{
    return !!store.getState().get('completedOperations').get(operation);
};

const addCompletedOperation = operation => {
    if (operationExists(operation)){
        return;
    }

    createCompletedOperationInStore(operation);

    const callback = (needed)=>{
        updateCompletedOperationInStore(operation, 'needed', needed);
        if (needed.toNumber()){
            return;
        }
        updateCompletedOperation(operation);
    };

    AppDAO.pendingYetNeeded(operation, account).then( needed => callback(needed) );
};

const updateCompletedOperation = (operation)=>{
    const callback = (valueName, value) => {
        updateCompletedOperationInStore(operation, valueName, value);
    };

    AppDAO.getTxsType(operation, account).then( type => callback('type', type) );
};

const handleConfirmation = (e, r) => {
    if(!e){
        addCompletedOperation(r.args.operation);
    }
};

const handleGetOperations = (e, r) => {
    if(!e){
        for(let i=0; i< r.length; i++){
            addCompletedOperation(r[i].args.operation);
        }
    }
};

AppDAO.confirmationWatch(handleConfirmation);
AppDAO.confirmationGet(handleGetOperations, {fromBlock: 0, toBlock: 'latest'});

export default initialState;
