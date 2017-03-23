import {store} from '../../init';
import * as actions from '../../../src/redux/ducks/watcher';

describe('watcher', () => {
    it('should dispatch cbeWatcher', () => {
        store.dispatch(actions.cbeWatcher());
        expect(store.getActions()).toEqual([]);
    });
});