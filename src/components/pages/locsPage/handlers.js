import {showLOCModal, showIssueLHModal} from '../../../redux/ducks/ui/modal';
import {storeLoc} from '../../../redux/ducks/locs/loc';


export const handleShowLOCModal = (loc) => (dispatch) => {
    dispatch(storeLoc(loc));
    const locExists = !!loc;
    dispatch(showLOCModal({locExists}));
};

export const handleShowIssueLHModal = (loc) => (dispatch) => {
    dispatch(storeLoc(loc));
    dispatch(showIssueLHModal());
};
