import LOCModel from '../../models/LOCModel'

const LOC_STORE = 'loc/STORE';

const reducer = (state = null, action) => {
    switch (action.type) {
        case LOC_STORE:
            return action.payload || new LOCModel();
        default:
            return state;
    }
};

export const storeLOCAction = payload => ({type: LOC_STORE, payload});
export default reducer;