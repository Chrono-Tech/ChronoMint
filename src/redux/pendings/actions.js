import UserDAO from '../../dao/UserDAO';
import { showAlertModal } from '../ui/modal';
import { updatePropsInStore } from './operationsProps/data';

const setRequiredSignatures = (required, account, hideModal) => (dispatch) => {
    return UserDAO.setRequiredSignatures(required, account)
        .then(r => {
            if(r) {
                hideModal();
                dispatch(updatePropsInStore('signaturesRequired', required));
            } else {
                dispatch(showAlertModal({title: 'Error', message: 'Number of Required Signatures is not changed'}))
            }
        });
};

export {
    setRequiredSignatures,
    // handleChangeNumberSignaturesModal,
}