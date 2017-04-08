import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Web3 from 'web3'
import initLocalStorageMock from './mock/localStorage'
import OrbitDAO from '../src/dao/OrbitDAO'
import AbstractContractDAO from '../src/dao/AbstractContractDAO'

// we need enough time to test contract watch functionality
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

initLocalStorageMock()

AbstractContractDAO._web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const mockStore = configureMockStore([thunk])
export let store = null

beforeAll(() => {
  window.resolveWeb3 = Promise.resolve(null)
  return OrbitDAO.init(null)
})

beforeEach(() => {
  window.localStorage.clear()
  AbstractContractDAO.stopWatching()
  store = mockStore()
})
