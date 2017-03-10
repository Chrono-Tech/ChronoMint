const LOC_PASS = 'loc/PASS';
const passLOCAction = payload => ({type: LOC_PASS, payload});

const reducer = (state = null, action) => {
    switch (action.type) {
        case LOC_PASS:
            return action.payload || null;
        default:
            return state;
    }
};

export const passLocAddress = address => dispatch => dispatch(passLOCAction(address));

export default reducer;