import {store} from '../../configureStore';
import LOCModel from '../../../models/LOCModel'
const LOC_LOAD = 'loc/LOAD';
const loadLocAction = payload => ({type: LOC_LOAD, payload});

const reducer = (state = new LOCModel(), action) => {
    switch (action.type) {
        case LOC_LOAD:
            return store.getState().get('locs').get(action.payload) || new LOCModel();
        default:
            return state;
    }
};

export const loadLoc = loc => dispatch => dispatch(loadLocAction(loc));

export default reducer;