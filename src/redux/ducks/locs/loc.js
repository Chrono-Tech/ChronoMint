import {store} from '../../configureStore';
import LocModel from '../../../models/LocModel'
const LOC_LOAD = 'loc/LOAD';
const loadLocAction = payload => ({type: LOC_LOAD, payload});

const reducer = (state = new LocModel(), action) => {
    switch (action.type) {
        case LOC_LOAD:
            return store.getState().get('locs').get(action.payload) || new LocModel();
        default:
            return state;
    }
};

export const loadLoc = loc => dispatch => dispatch(loadLocAction(loc));

export default reducer;