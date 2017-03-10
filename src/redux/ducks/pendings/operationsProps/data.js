import AppDAO from '../../../../dao/AppDAO';
import {updatePropsAction} from './reducer';
import {used} from '../../../../components/common/flags';

const updatePropsInStore = (valueName, value) => dispatch => {
    dispatch(updatePropsAction({valueName, value}));
};

const getProps = (account) => dispatch => {
    AppDAO.required(account).then(signaturesRequired => {
        dispatch(updatePropsInStore('signaturesRequired', signaturesRequired));
    });
};

export const getPropsOnce = () => dispatch => {
    if (used(getProps)) return;
    dispatch(getProps(localStorage.chronoBankAccount));
};
