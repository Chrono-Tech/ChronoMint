import { removeLOCAction} from './reducer';

const removeLOCfromStore = (address) => (dispatch) => {
    dispatch(removeLOCAction({address}));
};

export {
    removeLOCfromStore,
}