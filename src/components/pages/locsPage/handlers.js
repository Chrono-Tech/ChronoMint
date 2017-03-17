import {showLOCModal, showIssueLHModal, showUploadedFileModal } from '../../../redux/ducks/ui/modal';
import {storeLOCAction} from '../../../redux/ducks/locs/loc';
import IPFSDAO from '../../../dao/IPFSDAO';

export const handleShowLOCModal = (loc) => (dispatch) => {
    dispatch(storeLOCAction(loc));
    const locExists = !!loc;
    dispatch(showLOCModal({locExists}));
};

export const handleShowIssueLHModal = (loc) => (dispatch) => {
    dispatch(storeLOCAction(loc));
    dispatch(showIssueLHModal());
};

export const handleViewContract = (loc) => (dispatch) => {
    IPFSDAO.node.files.cat(loc.get('publishedHash'), (e, r) => {
        let data = '';
        r.on('data', (d) => {
            data = data + d
        });
        r.on('end', () => {
            dispatch(showUploadedFileModal({data}));
        });
    });
};
