import { removeLocAction} from './reducer';

const removeLOCfromStore = (address) => (dispatch) => {
    dispatch(removeLocAction({address}));
};

export {
    removeLOCfromStore,
}