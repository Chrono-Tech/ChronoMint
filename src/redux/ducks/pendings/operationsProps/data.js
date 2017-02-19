import AppDAO from '../../../../dao/AppDAO';
import {updatePropsInStore} from './reducer';
import Props from '../../../../models/OperationsProps'

const initialState = new Props();

const getProps = (account) => {
    AppDAO.required(account).then(signaturesRequired => {
        updatePropsInStore('signaturesRequired', signaturesRequired);
    });
};

getProps(localStorage.chronoBankAccount);

export default initialState;
