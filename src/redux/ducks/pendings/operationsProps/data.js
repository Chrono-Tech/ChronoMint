import AppDAO from '../../../../dao/AppDAO';
import {store} from '../../../configureStore';
import {updatePropsAction} from './reducer';

const usedOnce = {};

const updatePropsInStore = (valueName, value)=> {
    store.dispatch(updatePropsAction({valueName, value}));
};

const getProps = (account) => {
    AppDAO.required(account).then(signaturesRequired => {
        updatePropsInStore('signaturesRequired', signaturesRequired);
    });
};

export const getPropsOnce = () => {
    if (usedOnce.getProps == (usedOnce.getProps = true)) return;
    getProps(localStorage.chronoBankAccount);
};
