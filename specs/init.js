import initLocalStorageMock from './mock/localStorage';

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

initLocalStorageMock();