import AppDAO from '../../../../dao/AppDAO';
import {store} from '../../../configureStore';
import {updatePropsAction} from './reducer';
import {used} from '../../../../components/common/flags';

const updatePropsInStore = (valueName, value)=> {
    store.dispatch(updatePropsAction({valueName, value}));
};

const getProps = (account) => {
    AppDAO.required(account).then(signaturesRequired => {
        updatePropsInStore('signaturesRequired', signaturesRequired);
    });
};

export const getPropsOnce = () => {
    if (used(getProps)) return;
    getProps(localStorage.chronoBankAccount);
};
