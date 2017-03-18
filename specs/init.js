import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import initLocalStorageMock from './mock/localStorage';
import OrbitDAO from '../src/dao/OrbitDAO';

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

initLocalStorageMock();

const mockStore = configureMockStore([thunk]);
export let store = null;

beforeAll(() => {
    return OrbitDAO.init(null);
});

beforeEach(() => {
    localStorage.clear();
    store = mockStore();
});