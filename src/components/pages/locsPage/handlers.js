import {showLOCModal, showIssueLHModal} from '../../../redux/ducks/ui/modal';
import {storeLOCAction} from '../../../redux/ducks/locs/loc';

export const handleShowLOCModal = (loc) => (dispatch) => {
    dispatch(storeLOCAction(loc));
    const locExists = !!loc;
    dispatch(showLOCModal({locExists}));
};

export const handleShowIssueLHModal = (loc) => (dispatch) => {
    dispatch(storeLOCAction(loc));
    dispatch(showIssueLHModal());
};
