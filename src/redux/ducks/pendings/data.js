import AppDAO from '../../../dao/AppDAO';
import {updatePropsInStore, addPendingToStore, updatePendingInStore, removePendingFromStore} from './reducer';
import {Map} from 'immutable';
import BigNumber from 'bignumber.js';
import {store} from '../../configureStore';

//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};

const account = localStorage.chronoBankAccount;

const initialState = new Map([
    ['items', new Map([])],
    ['props', new Map([['signaturesRequired', new BigNumber(0)], ])],
]);

const operationExists = (operation)=>{
    return !!store.getState().get('pendings').get('items').get(operation);
};

const handlePending = operation => {
    const callback = (needed) => {
        if (!needed.toNumber()){
            removePendingFromStore;
            return;
        }
        if (!operationExists(operation)){
            addPendingToStore(operation);
        }
        updatePendingInStore(operation, 'needed', needed);
        updatePending(operation);
    };

    AppDAO.pendingYetNeeded(operation, account).then( needed => callback(needed) );
};

const updatePending = (operation) => {
    const callback = (valueName, value) => {
        updatePendingInStore(operation, valueName, value);
    };

    AppDAO.getTxsType(operation, account).then( type => callback('type', type) );
    AppDAO.getTxsData(operation, account).then( data => callback('data', data) );
    AppDAO.hasConfirmed(operation, account, account).then( hasConfirmed => callback('hasConfirmed', hasConfirmed) );
};

const getPendings = (account) => {
    AppDAO.required(account).then(signaturesRequired => {
        updatePropsInStore('signaturesRequired', signaturesRequired);
    });
    AppDAO.pendingsCount(account).then(count => {
        for(let i = 0; i < count.toNumber(); i++) {
            AppDAO.pendingById(i, account).then( (operation) => {
                handlePending(operation);
            })
        }
    });
};

const revoke = (data) => {
    AppDAO.revoke(data['operation'], account);
};

const confirm = (data) => {
    AppDAO.confirm(data['operation'], account);
};

const handleWatchOperation = (e, r) => {
    if(!e){
        handlePending(r.args.operation)
    }
};

AppDAO.revokeWatch(handleWatchOperation);

AppDAO.confirmationWatch(handleWatchOperation);

getPendings(account);

export default initialState;

export {
    revoke,
    confirm,
}