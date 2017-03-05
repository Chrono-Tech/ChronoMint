import AppDAO from '../../../dao/AppDAO';
import {createPendingAction, updatePendingAction, removePendingAction} from './reducer';
import {store} from '../../configureStore';
import {loadLOC} from '../locs/data';
import {removeLOCfromStore} from '../locs/locs';
import {notify} from '../../../redux/ducks/notifier/notifier';
import PendingOperationNoticeModel from '../../../models/notices/PendingOperationNoticeModel';
import {used} from '../../../components/common/flags';
import {
    PENDINGS_LOADING,
    PENDINGS_LOADED,
} from './actions';

//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};

const pendingsLoading = () => ({type: PENDINGS_LOADING});
const pendingsLoaded = (payload) => ({type: PENDINGS_LOADED, payload});

const operationExists = (operation) => {
    return !!store.getState().get('pendings').get(operation);
};

const addPendingToStore = (operation) => {
    store.dispatch(createPendingAction({operation}));
};

const updatePendingPropInStore = (operation, valueName, value) => {
    store.dispatch(updatePendingAction({valueName, value, operation}));
};

const updateNewPending = (operation, account) => {
    const callback = (valueName, value) => {
        updatePendingPropInStore(operation, valueName, value);
    };
    const promises = [];
    promises.push(AppDAO.getTxsType(operation, account).then(type => callback('type', type)));
    promises.push(AppDAO.getTxsData(operation, account).then(data => callback('data', data)));
    return Promise.all(promises);
};

const removePendingFromStore = (operation) => {
    store.dispatch(removePendingAction({operation}));
};

const updateExistingPending = (operation, account) => {
    const callback = (valueName, value) => {
        updatePendingPropInStore(operation, valueName, value);
    };
    return AppDAO.hasConfirmed(operation, account, account).then(hasConfirmed => callback('hasConfirmed', hasConfirmed));
};

const handlePending = (operation, account) => {
    const updateLOCs = (locs, operationObj) => {
        const addr = operationObj.targetAddress();
        const promises = [];
        if (!locs.includes(addr)) {
            removeLOCfromStore(addr);
        }
        locs.forEach((addr) => { promises.push (loadLOC(addr)) });
        return Promise.all(promises);
    };

    const callback = (needed) => {
        const promises = [];
        if (!needed.toNumber()) {
            const operationObj = store.getState().get('pendings').get(operation);
            if (operationObj && operationObj.targetAddress()) {
                promises.push(AppDAO.getLOCs(account).then(locs => updateLOCs(locs, operationObj)))
            }
            removePendingFromStore(operation);
            return Promise.all(promises).then(() => Promise.resolve(operationObj));
        }
        if (!operationExists(operation)) {
            addPendingToStore(operation);
            promises.push(updateNewPending(operation, account));
        }
        updatePendingPropInStore(operation, 'needed', needed);
        promises.push(updateExistingPending(operation, account));
        return Promise.all(promises).then(() => Promise.resolve(store.getState().get('pendings').get(operation)));

    };

    return AppDAO.pendingYetNeeded(operation, account).then(callback);//todo (callback)
};

const getPendings = (account) => (dispatch) => {
    dispatch(pendingsLoading());
    const promises = [];
    AppDAO.pendingsCount(account).then(count => {
        for (let i = 0; i < count.toNumber(); i++) {
            let promise = AppDAO.pendingById(i, account).then(operation => handlePending(operation, account));
            promises.push(promise);
        }
        Promise.all(promises).then(() => dispatch(pendingsLoaded()));
    });
};

const getPendingsOnce = () => (dispatch) => {
    if (used(getPendings)) return;
    dispatch(getPendings(localStorage.chronoBankAccount));
};

const revoke = (data, account) => {
    AppDAO.revoke(data['operation'], account);
};

const confirm = (data, account) => {
    AppDAO.confirm(data['operation'], account);
};

const handleConfirmOperation = (operation, account) => (dispatch) => {
    handlePending(operation, account).then((pending) => {
        if (pending) {
            dispatch(notify(new PendingOperationNoticeModel({pending})))
        }
    })
};

const handleRevokeOperation = (operation, account) => (dispatch) => {
    handlePending(operation, account).then((pending) => {
            dispatch(notify(new PendingOperationNoticeModel({pending, revoke: true})))
        }
    )
};

export {
    revoke,
    confirm,
    getPendingsOnce,
    handleConfirmOperation,
    handleRevokeOperation,
}