import {List} from 'immutable';
import {saveNotice} from '../session/data';
import NoticeModel from '../../../models/notices/NoticeModel';

export const NOTIFIER_MESSAGE = 'notifier/MESSAGE';
export const NOTIFIER_CLOSE = 'notifier/CLOSE';
export const NOTIFIER_LIST = 'notifier/LIST';

const initialState = {
    notice: new NoticeModel(),
    list: new List()
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFIER_MESSAGE:
            return {
                ...state,
                notice: action.notice
            };
        case NOTIFIER_LIST:
            return {
                ...state,
                list: action.list
            };
        case NOTIFIER_CLOSE:
            return {
                ...state,
                notice: new NoticeModel()
            };
        default:
            return state;
    }
};

const notify = (notice: NoticeModel) => (dispatch) => {
    dispatch({type: NOTIFIER_MESSAGE, notice});
    dispatch(saveNotice(notice));
};

const listNotifier = (list: List) => ({type: NOTIFIER_LIST, list});
const closeNotifier = () => ({type: NOTIFIER_CLOSE});

export {
    notify,
    listNotifier,
    closeNotifier
}

export default reducer;