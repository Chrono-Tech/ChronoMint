import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import initLocalStorageMock from './mock/localStorage';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

initLocalStorageMock();

const mockStore = configureMockStore([thunk]);
export let store = null;

beforeEach(() => {
    localStorage.clear();
    store = mockStore();
});