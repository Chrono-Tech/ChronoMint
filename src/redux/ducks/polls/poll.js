const POLL_PASS = 'poll/PASS';
const passPollAction = payload => ({type: POLL_PASS, payload});

const reducer = (state = null, action) => {
    switch (action.type) {
        case POLL_PASS:
            return action.payload || null;
        default:
            return state;
    }
};

export const passPollIndex = index => dispatch => dispatch(passPollAction(index));

export default reducer;