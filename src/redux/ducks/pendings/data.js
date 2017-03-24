import PendingManagerDAO from '../../../dao/PendingManagerDAO';
import UserDAO from '../../../dao/UserDAO';
import {createPendingAction, updatePendingAction, removePendingAction} from './reducer';
import {notify} from '../../../redux/ducks/notifier/notifier';
import PendingOperationNoticeModel from '../../../models/notices/PendingOperationNoticeModel';
import {pendingsLoadStartAction, pendingsLoadSuccessAction} from './communication';
import {handleCompletedConfirmation} from '../completedOperations/data';

const calculateTargetObjName = (operationAddress) => (dispatch, getState) => {
    const operationModel = getState().get('pendings').get(operationAddress);
    const targetAddress = operationModel.targetAddress();
    if (operationModel.functionName() == 'addKey') {
        return UserDAO.getMemberProfile(targetAddress).then(r => r.name() ? r.name() : targetAddress)
    }

    return Promise.resolve(targetAddress);
};

const updateNewPending = (operation, account) => (dispatch) => {
    const callback = (valueName, value) => {
        dispatch(updatePendingAction({valueName, value, operation}));
    };
    const promises = [];
    promises.push(PendingManagerDAO.getTxsType(operation, account).then(type => callback('type', type)));
    promises.push(PendingManagerDAO.getTxsData(operation, account).then(data => callback('data', data)));
    return Promise.all(promises)
        .then(() => dispatch(calculateTargetObjName(operation)))
        .then(objName => callback('targetObjName', objName));
};

const removePendingFromStore = (operation) => (dispatch) => {
    dispatch(removePendingAction({operation}));
};

const updateExistingPending = (operation, account) => (dispatch) => {
    const callback = (valueName, value) => {
        dispatch(updatePendingAction({valueName, value, operation}));
    };
    return PendingManagerDAO.hasConfirmed(operation, account, account).then(hasConfirmed => callback('hasConfirmed', hasConfirmed));
};

const handlePending = (operation, account) => (dispatch) => {
    const callback = (needed) => (dispatch, getState) => {
        if (!needed) {   //  confirmed
            const operationObj = getState().get('pendings').get(operation);
            dispatch(removePendingFromStore(operation));
            return Promise.resolve(operationObj);
        }
        const promises = [];
        if (!getState().get('pendings').get(operation)) {
            dispatch(createPendingAction({operation}))
            promises.push(dispatch(updateNewPending(operation, account)));
        }
        dispatch(updatePendingAction({valueName: 'needed', value: needed, operation}));
        promises.push(dispatch(updateExistingPending(operation, account)));
        return Promise.all(promises).then(() => Promise.resolve(getState().get('pendings').get(operation)));
    };

    return PendingManagerDAO.pendingYetNeeded(operation, account).then(needed => dispatch(callback(needed)));
};

const getPendings = (account) => (dispatch) => {
    dispatch(pendingsLoadStartAction());
    const promises = [];
    PendingManagerDAO.pendingsCount(account).then(count => {
        for (let i = 0; i < count; i++) {
            let promise = PendingManagerDAO.pendingById(i, account).then(operation => dispatch(handlePending(operation, account)));
            promises.push(promise);
        }
        Promise.all(promises).then(() => dispatch(pendingsLoadSuccessAction()));
    });
};

const revoke = (data, account) => {
    PendingManagerDAO.revoke(data['operation'], account);
};

const confirm = (data, account) => {
    PendingManagerDAO.confirm(data['operation'], account);
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
    getPendings,
    handlePendingConfirmation,
    handleRevokeOperation,
}