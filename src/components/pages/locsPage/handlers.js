import {showLOCModal, showIssueLHModal} from '../../../redux/ducks/ui/modal';
import {passLocAddress} from '../../../redux/ducks/locs/loc';


export const handleShowLOCModal = (locKey) => (dispatch) => {
    dispatch(passLocAddress(locKey));
    dispatch(showLOCModal({locKey}));
};

export const handleShowIssueLHModal = (locKey) => (dispatch) => {
    dispatch(passLocAddress(locKey));
    dispatch(showIssueLHModal({locKey}));
};
