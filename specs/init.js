import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import initLocalStorageMock from './mock/localStorage';

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

initLocalStorageMock();

const mockStore = configureMockStore([thunk]);
export let store = null;

beforeEach(() => {
    localStorage.clear();
    store = mockStore();
});