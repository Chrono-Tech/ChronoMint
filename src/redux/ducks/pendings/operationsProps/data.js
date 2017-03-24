import UserDAO from '../../../../dao/UserDAO';
import {updatePropsAction} from './reducer';
import {OPERATIONS_PROPS_LOAD_START, OPERATIONS_PROPS_LOAD_SUCCESS} from './communication';

const operationsPropsLoadStartAction = () => ({type: OPERATIONS_PROPS_LOAD_START});
const operationsPropsLoadSuccessAction = (payload) => ({type: OPERATIONS_PROPS_LOAD_SUCCESS, payload});

export const updatePropsInStore = (valueName, value) => dispatch => {
    dispatch(updatePropsAction({valueName, value}));
};

export const getProps = (account) => dispatch => {
    dispatch(operationsPropsLoadStartAction());
    UserDAO.signaturesRequired(account).then(signaturesRequired => {
        dispatch(updatePropsInStore('signaturesRequired', signaturesRequired));
        dispatch(operationsPropsLoadSuccessAction());
    });
};
