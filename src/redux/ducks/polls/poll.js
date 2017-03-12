import {store} from '../../configureStore';
import PollModel from '../../../models/PollModel'
const POLL_LOAD = 'poll/LOAD';
const loadPollAction = payload => ({type: POLL_LOAD, payload});

const reducer = (state = new PollModel(), action) => {
    switch (action.type) {
        case POLL_LOAD:
            return store.getState().get('polls').get(action.payload) || new PollModel();
        default:
            return state;
    }
};

export const storePoll = index => dispatch => dispatch(loadPollAction(index));

export default reducer;