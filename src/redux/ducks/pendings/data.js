import AppDAO from '../../../dao/AppDAO';
import {createPendingAction, updatePendingAction, removePendingAction} from './reducer';
import {loadLOC} from '../locs/data';
import {removeLOCfromStore} from '../locs/locs';
import {notify} from '../../../redux/ducks/notifier/notifier';
import PendingOperationNoticeModel from '../../../models/notices/PendingOperationNoticeModel';
import {used} from '../../../components/common/flags';
import {
    PENDINGS_LOADING,
    PENDINGS_LOADED,
} from './actions';
import {handleCompletedConfirmation} from '../completedOperations/data';

//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};

const pendingsLoading = () => ({type: PENDINGS_LOADING});
const pendingsLoaded = (payload) => ({type: PENDINGS_LOADED, payload});

const operationExists = (operation) => (dispatch, getState) => {
    return !!getState().get('pendings').get(operation);
};

const addPendingToStore = (operation) => (dispatch) => {
    dispatch(createPendingAction({operation}));
};

const updatePendingPropInStore = (operation, valueName, value) => (dispatch) => {
    dispatch(updatePendingAction({valueName, value, operation}));
};

const updateNewPending = (operation, account) => (dispatch) => {
    const callback = (valueName, value) => {
        dispatch(updatePendingPropInStore(operation, valueName, value));
    };
    const promises = [];
    promises.push(AppDAO.getTxsType(operation, account).then(type => callback('type', type)));
    promises.push(AppDAO.getTxsData(operation, account).then(data => callback('data', data)));
    return Promise.all(promises);
};

const removePendingFromStore = (operation) => (dispatch) => {
    dispatch(removePendingAction({operation}));
};

const updateExistingPending = (operation, account) => (dispatch) => {
    const callback = (valueName, value) => {
        dispatch(updatePendingPropInStore(operation, valueName, value));
    };
    return AppDAO.hasConfirmed(operation, account, account).then(hasConfirmed => callback('hasConfirmed', hasConfirmed));
};

const handlePending = (operation, account) => (dispatch) => {
    const updateLOCs = (locs, operationObj) => {
        const addr = operationObj.targetAddress();
        const promises = [];
        if (!locs.includes(addr)) {
            dispatch(removeLOCfromStore(addr));
        }
        locs.forEach((addr) => { promises.push (dispatch(loadLOC(addr))) });
        return Promise.all(promises);
    };

    const callback = (needed) => (dispatch, getState) => {
        const promises = [];
        if (!needed.toNumber()) {
            const operationObj = getState().get('pendings').get(operation);
            if (operationObj && operationObj.targetAddress()) {
                promises.push(AppDAO.getLOCs(account).then(locs => updateLOCs(locs, operationObj)))
            }
            dispatch(removePendingFromStore(operation));
            return Promise.all(promises).then(() => Promise.resolve(operationObj));
        }
        if (!dispatch(operationExists(operation))) {
            dispatch(addPendingToStore(operation));
            promises.push(dispatch(updateNewPending(operation, account)));
        }
        dispatch(updatePendingPropInStore(operation, 'needed', needed));
        promises.push(dispatch(updateExistingPending(operation, account)));
        return Promise.all(promises).then(() => Promise.resolve(getState().get('pendings').get(operation)));

    };

    return AppDAO.pendingYetNeeded(operation, account).then(needed => dispatch(callback(needed)));//todo (callback)??
};

const getPendings = (account) => (dispatch) => {
    dispatch(pendingsLoading());
    const promises = [];
    AppDAO.pendingsCount(account).then(count => {
        for (let i = 0; i < count.toNumber(); i++) {
            let promise = AppDAO.pendingById(i, account).then(operation => dispatch(handlePending(operation, account)));
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

const handlePendingConfirmation = (operation, account) => (dispatch) => {
    dispatch(handleCompletedConfirmation(operation));
    dispatch(handlePending(operation, account)).then((pending) => {
        if (pending) {
            dispatch(notify(new PendingOperationNoticeModel({pending})))
        }
    })
};

const handleRevokeOperation = (operation, account) => (dispatch) => {
    dispatch(handlePending(operation, account)).then((pending) => {
            dispatch(notify(new PendingOperationNoticeModel({pending, revoke: true})))
        }
    )
};

export {
    revoke,
    confirm,
    getPendingsOnce,
    handlePendingConfirmation,
    handleRevokeOperation,
}