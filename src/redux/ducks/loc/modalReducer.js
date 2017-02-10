import LocModel from './model'
const initialState = new LocModel();
const LOC_LOAD = 'loc/LOAD';

const loadLocAction = payload => ({type: LOC_LOAD, payload});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOC_LOAD:
            return new LocModel(action.payload);
        default:
            return state;
    }
};

export const loadLoc = loc => dispatch => dispatch(loadLocAction(loc));

export default reducer;