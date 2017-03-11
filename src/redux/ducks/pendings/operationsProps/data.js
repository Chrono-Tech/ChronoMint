import AppDAO from '../../../../dao/AppDAO';
import {updatePropsAction} from './reducer';
import {OPERATIONS_PROPS_LOAD_START, OPERATIONS_PROPS_LOAD_SUCCESS} from './communication';

const operationsPropsLoadStartAction = () => ({type: OPERATIONS_PROPS_LOAD_START});
const operationsPropsLoadSuccessAction = (payload) => ({type: OPERATIONS_PROPS_LOAD_SUCCESS, payload});

const updatePropsInStore = (valueName, value) => dispatch => {
    dispatch(updatePropsAction({valueName, value}));
};

const getProps = (account) => dispatch => {
    dispatch(operationsPropsLoadStartAction());
    AppDAO.required(account).then(signaturesRequired => {
        dispatch(updatePropsInStore('signaturesRequired', signaturesRequired));
        dispatch(operationsPropsLoadSuccessAction());
    });
};

export const getPropsOnce = () => (dispatch, getState) => {
    if (!getState().get('operationsPropsCommunication').isNeedReload) return;
    dispatch(getProps(localStorage.chronoBankAccount));
};
