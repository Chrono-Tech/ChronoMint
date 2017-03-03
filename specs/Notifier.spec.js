import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {List} from 'immutable';
import reducer, * as actions from '../src/redux/ducks/notifier/notifier';
import NoticeModel from '../src/models/notices/NoticeModel';

const mockStore = configureMockStore([thunk]);
let store = null;

const notice = new NoticeModel({message: 'test'});
let list = new List();
list = list.set(0, notice);

describe('notifier', () => {
    beforeEach(() => {
        store = mockStore();
        localStorage.clear();
    });

    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual({
            notice: new NoticeModel(),
            list: new List()
        });
    });

    it('should handle NOTIFIER_MESSAGE', () => {
        expect(
            reducer([], {type: actions.NOTIFIER_MESSAGE, notice})
        ).toEqual({
            notice
        });
    });

    it('should handle NOTIFIER_LIST', () => {
        expect(
            reducer([], {type: actions.NOTIFIER_LIST, list})
        ).toEqual({
            list
        });
    });

    it('should handle NOTIFIER_CLOSE', () => {
        expect(
            reducer([], {type: actions.NOTIFIER_CLOSE})
        ).toEqual({
            notice: new NoticeModel()
        });
    });

    it('should notify, save notice in local storage and return list from this storage', () => {
        store.dispatch(actions.notify(notice));
        expect(store.getActions()).toEqual([
            {type: actions.NOTIFIER_MESSAGE, notice},
            {type: actions.NOTIFIER_LIST, list}
        ]);
    });

    it('should create an action to list notices', () => {
        expect(actions.listNotifier(list)).toEqual({type: actions.NOTIFIER_LIST, list});
    });

    it('should create an action to close notifier', () => {
        expect(actions.closeNotifier()).toEqual({type: actions.NOTIFIER_CLOSE});
    });
});