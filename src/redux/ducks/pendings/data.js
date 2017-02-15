import AppDAO from '../../../dao/AppDAO';
import {updatePropsInStore, addPendingToStore, updatePendingInStore} from './reducer';
import {Map} from 'immutable';
import BigNumber from 'bignumber.js';
import {store} from '../../configureStore';

const account = localStorage.chronoBankAccount;

const initialState = new Map([
    ['items', new Map([])],
    ['props', new Map([['signaturesRequired', new BigNumber(0)], ])],
]);

const updatePending = (operation)=>{
    const callback = (valueName, value)=>{
        updatePendingInStore(valueName, value, operation);
    };

    AppDAO.getTxsType(operation, account).then( type=>callback( 'type', type) );
    AppDAO.pendingYetNeeded(operation, account).then( needed=>callback('needed', needed) );
    AppDAO.hasConfirmed(operation, account, account).then( hasConfirmed=>callback('hasConfirmed', hasConfirmed) );
};

const operationExists = (operation)=>{
    return !!store.getState().get('pendings').get('items').get(operation);
};

const addPending = (operation)=>{
    if (!operationExists(operation)){
        addPendingToStore(operation);
    }
    updatePending(operation);
};

const getPendings = (account) => {
    AppDAO.required(account).then(signaturesRequired => {
        updatePropsInStore('signaturesRequired', signaturesRequired);
    });
    AppDAO.pendingsCount(account).then(count => {
        for(let i = 0; i < count.toNumber(); i++) {
            AppDAO.pendingById(i, account).then( (operation) => {
                addPending(operation);
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
        addPending(r.args.operation)
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