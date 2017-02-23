import AppDAO from '../../../dao/AppDAO';
import {addPendingToStore, updatePendingPropInStore, removePendingFromStore} from './reducer';
import {store} from '../../configureStore';
import {loadLOC, removeLOCfromStore} from '../locs/data';
import {Map} from 'immutable';

const initialState = new Map([]);

//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};

const operationExists = (operation) => {
    return !!store.getState().get('pendings').get(operation);
};

const updateNewPending = (operation, account) => {
    const callback = (valueName, value) => {
        updatePendingPropInStore(operation, valueName, value);
    };

    AppDAO.getTxsType(operation, account).then(type => callback('type', type));
    AppDAO.getTxsData(operation, account).then(data => callback('data', data));
};

const updateExistingPending = (operation, account) => {
    const callback = (valueName, value) => {
        updatePendingPropInStore(operation, valueName, value);
    };

    AppDAO.hasConfirmed(operation, account, account).then(hasConfirmed => callback('hasConfirmed', hasConfirmed));
};

const handlePending = (operation, account) => {
    const callback = (needed) => {
        if (!needed.toNumber()) {
            let operationObj = store.getState().get('pendings').get(operation);
            if (operationObj && operationObj.targetAddress()) {
                AppDAO.getLOCs(account).then(
                    r => {
                        const addr = operationObj.targetAddress();
                        if (r.includes(addr)) {
                            loadLOC(addr)
                        } else {
                            removeLOCfromStore(addr);
                        }
                        r.forEach(loadLOC)
                    }
                );
            }

            removePendingFromStore(operation);
            return;
        }
        if (!operationExists(operation)) {
            addPendingToStore(operation);
            updateNewPending(operation, account)
        }
        updatePendingPropInStore(operation, 'needed', needed);
        updateExistingPending(operation, account);
    };

    AppDAO.pendingYetNeeded(operation, account).then(needed => callback(needed));
};

const getPendings = (account) => {
    AppDAO.pendingsCount(account).then(count => {
        for (let i = 0; i < count.toNumber(); i++) {
            AppDAO.pendingById(i, account).then((operation) => {
                handlePending(operation, account);
            })
        }
    });
};

const revoke = (data, account) => {
    AppDAO.revoke(data['operation'], account);
};

const confirm = (data, account) => {
    AppDAO.confirm(data['operation'], account);
};

const handleWatchOperation = (e, r) => {
    if (!e) {
        handlePending(r.args.operation)
    }
};

AppDAO.revokeWatch(handleWatchOperation);

AppDAO.confirmationWatch(handleWatchOperation);

// getPendings(localStorage.chronoBankAccount); moved to app

export default initialState;

export {
    revoke,
    confirm,
    getPendings
}